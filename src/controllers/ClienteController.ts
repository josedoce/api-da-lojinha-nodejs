import {Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { ClientesRepository } from '../repositories/ClientesRepository';
import {crieHash, compareHash} from '../gen/bcryptjs';
import jwt from 'jsonwebtoken';
import { ListaNegraRepository } from '../repositories/ListaNegraRepository';
const chave = process.env.JWT_SECRET_SEVER_TOKEN;
const expiracao = process.env.JWT_TOKEN_EXPIRATION;
class ClienteController {
    async criarUsuario(req: Request, res: Response){
        const {nome, email, senha} = req.body;

        const schema = yup.object().shape({
            nome: yup.string().required(),
            email: yup.string().email().required(),
            senha: yup.string().required().min(8).max(32),
        });
        
        try {
            await schema.validate(req.body, {abortEarly: false});
        } catch (error) {
            return res.status(400).json({error: 'Algum dado foi omitido.'});
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
        //apague lista negra
        const tokenNegro = getCustomRepository(ListaNegraRepository);
        const lista = await tokenNegro.find();

        lista.forEach(async(element)=>{
            const dados = jwt.decode(element.token);
            var horaAtual = Date.now() / 1000;
            if ( dados['exp'] < horaAtual) {
                await tokenNegro.delete(element.id);
            }
        })
        

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
    async logout(req: Request, res: Response){
        const listaNegra = getCustomRepository(ListaNegraRepository);
        const tokenExists = await listaNegra.find({where:{token: req.usuario.token}});
        
        if(!tokenExists[0]){
            const dados = listaNegra.create({
                token: req.usuario.token
            });
            await listaNegra.save(dados);
            res.status(201).json({tudoOk:"O token foi invalidado"});
            return;
        }
        res.status(401).json({erro: 'O token não pode ser invalidado.'})
        
    }
    async criarCliente(){

    }

    
}

export default new ClienteController();