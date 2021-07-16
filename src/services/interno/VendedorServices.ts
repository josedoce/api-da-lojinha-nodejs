import { getCustomRepository, Repository } from "typeorm";
import { Vendedores } from "../../models/Vendedores";
import { VendedoresRepository } from "../../repositories/VendedoresRepository";
import * as yup from 'yup';
import { Prateleira } from "../../models/Prateleira";
import { PrateleiraRepository } from "../../repositories/PrateleiraRepository";
import { AppError } from "../../errors/AppError";
import { CreateVendedor, LoginVendedor } from "../../tipagem";
import { compareHash, crieHash } from "../../gen/bcryptjs";
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";

interface IndexProducts{
    proximo: boolean;
    produtos: Prateleira[];
}
interface IndexProduct{
    produto: Prateleira;
}

class VendedorServices{
    private vendedorRepository: Repository<Vendedores>;
    constructor(){
        this.vendedorRepository = getCustomRepository(VendedoresRepository);
    }

    async index(page: number, id: string|number):Promise<any>{
        
    }

    async show(res: Response, dados:LoginVendedor){
        const {email, senha} = dados;
        const usuario = getCustomRepository(VendedoresRepository);

        const existeUsuario = await usuario.findOne({email: email});

        if(!existeUsuario){
            return res.status(400).json({error: 'usuario não existe ou o email está errado.'});
        }
        
        if(!compareHash(senha, existeUsuario.senha)){
            return res.status(400).json({error: 'a senha está incorreta.'});
        }

        jwt.sign({
            id: existeUsuario.id,
            email: existeUsuario.email
        }, 
            process.env.JWT_SECRET_SEVER_TOKEN,
            {
                expiresIn: process.env.JWT_TOKEN_EXPIRATION
            }, 
            (err, token)=>{
                if(err){
                return res.status(400).json({error: 'token não foi criado, tente logar navamente.'});
                }
                res.header('Authorization',token);

                return res.status(201).json({existeUsuario, token});
            }
        );
    }

    async create(res: Response, dados:CreateVendedor){
        
        const existeVendedor = await this.vendedorRepository.findOne({email: dados.email});
        if(existeVendedor){
            res.status(400).json({error: "Usuario já existe, tente logar se for sua."});
        }
        const {senha,...resto} = dados;
        const salveVendedor = this.vendedorRepository.create({
            ...resto,
            senha: crieHash(senha)
        });
        const vendedorSalvo = await this.vendedorRepository.save(salveVendedor);
        if(!vendedorSalvo){
            res.status(400).json({error: "Usuario não foi salvo"});
        }
        jwt.sign({
            id: vendedorSalvo.id,
            email: vendedorSalvo.email
        }, 
            process.env.JWT_SECRET_SEVER_TOKEN,
            {
                expiresIn: process.env.JWT_TOKEN_EXPIRATION
            },
            (err, token)=>{
                if(err){
                    res.status(400).json({error:"Token não foi criado, tente logar."});
                }
                res.header('Authorization',token);

                return res.status(200).json({vendedorSalvo, token});
            }
        );

    }

    async update(id: string, salve: object){
        const usuarioExiste = await this.vendedorRepository.findOne({id});
        if(!usuarioExiste){
            throw new AppError("Se chegou aqui és um invasor...",400);
        }
        await this.vendedorRepository.update(usuarioExiste.id,salve);
        return await this.vendedorRepository.findOne(usuarioExiste.id);
    }

    async delete(id: string){
        const usuarioExiste = await this.vendedorRepository.findOne({id});
        if(!usuarioExiste){
            throw new AppError("Se chegou aqui és um invasor...",400);
        }
        this.vendedorRepository.delete({id: usuarioExiste.id});
        return "O usuário foi apagado com sucesso.";
    }

};
export {VendedorServices};