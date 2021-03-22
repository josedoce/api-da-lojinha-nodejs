import { Request,NextFunction, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import jwt from 'jsonwebtoken';
import { VendedoresRepository } from '../../repositories/VendedoresRepository';
const chave = process.env.JWT_SECRET_SEVER_TOKEN;

const vendedorAuth = async (req: Request, res: Response, next: NextFunction )=>{
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
                    return res.status(401).json({erro: 'token invalido'})
                }
                
                const usuario = getCustomRepository(VendedoresRepository);

                usuario.findOne({where: {id: dados['id'], email: dados['email']}}).then((usuarioExiste)=>{

                    if(usuarioExiste.isVendedor === 'true'){
                        req.usuario = {id: usuarioExiste.id};
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