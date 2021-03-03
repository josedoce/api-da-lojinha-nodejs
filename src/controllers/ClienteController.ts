import {Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { ClientesRepository } from '../repositories/ClientesRepository';
import {crieHash, compareHash} from '../gen/bcryptjs';
import jwt from 'jsonwebtoken';
const chave = process.env.JWT_SECRET_SEVER_TOKEN;
const expiracao = process.env.JWT_TOKEN_EXPIRATION;
class ClienteController {
    async criarUsuario(req: Request, res: Response){
        const {nome, email, senha} = req.body;
        const schema = yup.object().shape({
            nome: yup.string().required('O nome é obrigatorio.'),
            email: yup.string().email('Um email valido é necessário.').required('É necessario um email para validação'),
            senha: yup.string().required('Uma senha com pelo menos 8 caracteres é necessaria.').min(8,'senha tem que ter pelo menos 8 caracteres').max(32, 'o tamanho da senha se limita a 32 caracteres')
        });
        try {
            await schema.validate(req.body, {abortEarly: false});
        } catch (error) {
            return res.status(400).json({error: error});
        }
        const usuario = getCustomRepository(ClientesRepository);
        
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
    async logarUsuario(req: Request, res: Response){
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

        const usuario = getCustomRepository(ClientesRepository);

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
    async criarCliente(){

    }

    
}

export default new ClienteController();