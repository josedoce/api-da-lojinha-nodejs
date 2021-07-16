import {Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import { ClientesRepository } from '../repositories/ClientesRepository';
import jwt from 'jsonwebtoken';
import { ListaNegraRepository } from '../repositories/ListaNegraRepository';
import { UsuarioServices } from '../services/interno/UsuarioServices';
const secretKey = process.env.JWT_SECRET_SEVER_TOKEN;
const expiration = process.env.JWT_TOKEN_EXPIRATION;

class ClienteController {
    async criarUsuario(req: Request, res: Response){
        const {nome, email, senha} = req.body;
        const usuarioServices = new UsuarioServices();
        try{
            const usuario = await usuarioServices.create({
                name: nome,
                email: email,
                password: senha
            });
            jwt.sign({id: usuario.id, email: usuario.email}, secretKey, {expiresIn: expiration}, (err, token)=>{
                if(err){
                    throw {
                        error: 'token não foi criado, tente logar.',
                        code: 401
                    };
                }
                const {senha, ...resto} = usuario;
                res.header('Authorization',token);
                return res.status(201).json({...resto, token});
            });
            
        }catch(e){
            return res.status(e.code).json(e);
        }
    }
    async logarUsuario(req: Request, res: Response){
        
        const usuarioServices = new UsuarioServices();
        const {email, senha} = req.body;

        try {
            const user = await usuarioServices.show({email: email, password: senha});

            jwt.sign({id: user.id, email: user.email}, secretKey, {expiresIn: expiration}, (err, token)=>{
                if(err){
                   throw {
                       error: 'token não foi criado, tente logar navamente.',
                       code: 401
                   };
                }
                res.header('Authorization',token);
                const {...resto} = user; //reavaliar em produção
                return res.status(201).json({...resto, token});
            });
        } catch (e) {
            return res.status(e.code).json(e);
        }
    }
    
}

export {ClienteController};