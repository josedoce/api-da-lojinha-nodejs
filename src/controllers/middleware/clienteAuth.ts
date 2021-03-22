import { Request,NextFunction, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { ClientesRepository } from '../../repositories/ClientesRepository';
import * as yup from 'yup';
import jwt from 'jsonwebtoken';
const chave = process.env.JWT_SECRET_SEVER_TOKEN;

const clienteAuth = async (req: Request, res: Response, next: NextFunction )=>{
    const authToken = req.headers.authorization;
    
    const schema = yup.string().required('Um token é necessario para está operação').min(100, 'Um token possui muitos caracteres...').max(240,'Este token não pode ser superior a 240 caracteres...');
    try {
        await schema.validate(authToken, {abortEarly: false});
    } catch (error) {
        return res.status(400).json({error: error});
    }
    let token = authToken.split(' ');
    
        if(token[1] != undefined){
            jwt.verify(token[1], chave,(err, dados)=>{
                
                if(err){
                    return res.status(401).json({erro: 'token invalido ou expirado.'})
                }
                
                const usuario = getCustomRepository(ClientesRepository);

                usuario.findOne({where: {id: dados['id'], email: dados['email']}}).then((usuarioExiste)=>{
                    
                    if(usuarioExiste.isCliente === 'true'){
                        //regra=usuário é cliente.
                        req.usuario = {id: usuarioExiste.id};
                        next();

                    }else{
                        //regra=usuário não é cliente.
                        //res.redirect('/criar_cliente');  //produção
                        res.status(401).json({error: 'Você ainda não é cliente, preecha todos os dados para se tornar.'});

                    }
                    
                }).catch((e)=> res.status(401).json({erro: 'token invalido'}))
                
            })
        }
}

export {clienteAuth};