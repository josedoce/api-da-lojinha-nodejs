import { Request, Response } from 'express';
import * as yup from 'yup';
import {v4 as uuid} from 'uuid';
import { getCustomRepository } from 'typeorm';
import { PrateleiraRepository } from '../repositories/PrateleiraRepository';
import {CreateProduct} from '../tipagem/index';

import {crieHash, compareHash} from '../gen/bcryptjs';
import jwt from 'jsonwebtoken';
import { VendedoresRepository } from '../repositories/VendedoresRepository';

const chave = process.env.JWT_SECRET_SEVER_TOKEN;
const expiracao = process.env.JWT_TOKEN_EXPIRATION;

class VendedoresController{
    async exibir(req: Request, res: Response){
        const produtos = getCustomRepository(VendedoresRepository);
        const productsForUser = await produtos.find({
            where: {id: req.usuario.id},
            relations: ['prateleira','prateleira.img_produto']
        });
        
        res.json(productsForUser);
    }
    async criarVendedor(req: Request, res: Response){
        const {nome, email, senha} = req.body;
        const schema = yup.object().shape({
            nome: yup.string().required(),
            email: yup.string().email().required(),
            senha: yup.string().required().min(8).max(32)
        });
        try {
            await schema.validate(req.body, {abortEarly: false});
        } catch (error) {
            return res.status(400).json({error: error});
        }
        const usuario = getCustomRepository(VendedoresRepository);
        
        const existeUsuario = await usuario.findOne({email: email});

        if(existeUsuario){
            return res.status(400).json({error: 'usuario já existe, tente logar.'});
        }

        const salveUsuario = usuario.create({
            nome,
            email,
            senha: crieHash(senha)
        });
        
        const usuarioSalvo = await usuario.save(salveUsuario);
        
        if(!usuarioSalvo){
            return res.status(400).json({error: 'usuario não foi salvo'});
        }

        jwt.sign({id: usuarioSalvo.id, email: usuarioSalvo.email}, chave, {expiresIn: expiracao}, (err, token)=>{
            if(err){
               return res.json({error: 'token não foi criado, tente logar.'});
            }
            res.header('Authorization',token);

            return res.json({usuarioSalvo, token});
        });
    }
    async logarVendedor(req: Request, res: Response){
        const {email, senha} = req.body;
        const schema = yup.object().shape({
            email: yup.string().email('Um email valido é necessário.').required('É necessario um email para login'),
            senha: yup.string().required('Uma senha com pelo menos 8 caracteres é necessaria.').min(8,'senha tem que ter pelo menos 8 caracteres').max(32, 'o tamanho da senha se limita a 32 caracteres')
        });

        try {
            await schema.validate(req.body, {abortEarly: false});
        } catch (error) {
            return res.status(400).json({error: error});
        }

        const usuario = getCustomRepository(VendedoresRepository);

        const existeUsuario = await usuario.findOne({email: email});

        if(!existeUsuario){
            return res.status(400).json({error: 'usuario não existe ou o email está errado.'});
        }
        
        if(!compareHash(senha, existeUsuario.senha)){
            return res.status(400).json({error: 'a senha está incorreta.'});
        }

        jwt.sign({id: existeUsuario.id, email: existeUsuario.email}, chave, {expiresIn: expiracao}, (err, token)=>{
            if(err){
               return res.status(400).json({error: 'token não foi criado, tente logar navamente.'});
            }
            res.header('Authorization',token);

            return res.status(201).json({existeUsuario, token});
        });
        
    }

   
    async criarProduto(req: Request, res: Response){
        const { 
            name,
            description,
            unid_disp,
            price,
            peso,
            formato,
            comprimento,
            altura,
            largura,
            servico,
            diametro,
        }:CreateProduct = req.body;
        
        const schema = yup.object().shape({
            name: yup.string().required(),
            description: yup.string().required(),
            price: yup.number().required(),
            unid_disp: yup.number().required(),
            peso: yup.string().required(),
            formato: yup.string().required(),
            comprimento: yup.string().required(),
            altura: yup.string().required(),
            largura: yup.string().required(),
            servico: yup.string().required(),
            diametro: yup.string().required(),
        });

        try {
            await schema.validate(req.body, {abortEarly: false});
        } catch (error) {
            return res.status(400).json({error: 'Alguns dados foram omitidos.'})
        }

        const algunsProdutos = getCustomRepository(PrateleiraRepository);
        
        const salveProduto = algunsProdutos.create({
            id_vendedor: String(req.usuario.id),
            codigo: uuid(),
            produto: name,
            descricao: description,
            preco_und: price,
            und_disp: unid_disp,
            peso: peso,
            formato: formato,
            comprimento: comprimento,
            altura: altura,
            largura: largura,
            servico: servico,
            diametro: diametro,
        });
        
        await algunsProdutos.save(salveProduto);
        
        return res.status(201).json(req.body);
    }

    
    
    async editarProduto(req: Request, res: Response){

        const produto = getCustomRepository(PrateleiraRepository);
        const editeProduto = await produto.find({
            where: {
                id: req.params.id_produto,
                id_vendedor: req.usuario.id
            },
            relations: ['img_produto']
        })
        res.json(editeProduto)
    }

}

export default new VendedoresController();