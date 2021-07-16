import { Request,NextFunction, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import jwt from 'jsonwebtoken';
import { VendedoresRepository } from '../../repositories/VendedoresRepository';
import { ListaNegraRepository } from '../../repositories/ListaNegraRepository';
const chave = process.env.JWT_SECRET_SEVER_TOKEN;

const vendedorAuth = async (req: Request, res: Response, next: NextFunction )=>{
    let authToken = req.headers.authorization;
    if(req.body.token){
        authToken = 'Bearer '+req.body.token;
    }
    
    const schema = yup.string().required('Um token é necessario para está operação').min(100, 'Um token possui muitos caracteres...').max(240,'Este token não pode ser superior a 240 caracteres...');
    try {
        await schema.validate(authToken, {abortEarly: false});
    } catch (error) {
        return res.status(400).json({error: error});
    }
    let token = authToken.split(' ');
    const ListaNegra = getCustomRepository(ListaNegraRepository);
    const isListaNegra = await ListaNegra.find({where: {token: token[1]}});
    if(isListaNegra[0]){
        return res.status(401).json({erro: 'token invalido ou expirado.'});
        //recomendado um redirect
    }
    if(token[1] != undefined){
        jwt.verify(token[1], chave,(err, dados)=>{
        
            if(err){
                return res.status(401).json({erro: 'token invalido'})
            }
            
            const usuario = getCustomRepository(VendedoresRepository);

            usuario.findOne({where: {id: dados['id'], email: dados['email']}}).then((usuarioExiste)=>{

                if(usuarioExiste.isVendedor === 'true'){
                    req.usuario = {
                        id: usuarioExiste.id,
                        token: token[1]
                    };
                    next();
                }else{
                    //regra=usuário não é cliente.
                    //res.redirect('/completar_cadastro');  //produção
                    res.status(401).json({error: 'Você ainda não é vendedor, preecha todos os dados para se tornar.'});

                }
                
            })
            
        })
    }
}

export {vendedorAuth};