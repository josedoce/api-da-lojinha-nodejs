import {Response, Request, NextFunction} from 'express';
import { getCustomRepository } from 'typeorm';
import { ListaNegraRepository } from '../../repositories/ListaNegraRepository';

/**
 * Esta middleware tem a função de invalidar o token.
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns void
 */
export async function hasLogout(req: Request, res: Response, next: NextFunction){

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
    return res.status(401).json({erro: 'O token não pode ser invalidado.'});
}