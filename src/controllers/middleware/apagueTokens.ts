import {Response, Request, NextFunction} from 'express';
import { getCustomRepository } from 'typeorm';
import { ListaNegraRepository } from '../../repositories/ListaNegraRepository';
import jwt from 'jsonwebtoken';

/**
 * Este middleware tem a função de apagar tokens invalidados do banco de dados.
 * @param req 
 * @param res 
 * @param next 
 */
export async function apagueTokens(req: Request, res: Response, next: NextFunction){
    
    const tokenNegro = getCustomRepository(ListaNegraRepository);
    const lista = await tokenNegro.find();

    lista.forEach(async(element)=>{
        const dados = jwt.decode(element.token);
        var horaAtual = Date.now() / 1000;
        if ( dados['exp'] < horaAtual) {
            await tokenNegro.delete(element.id);
        }
    })
    
    next();
}