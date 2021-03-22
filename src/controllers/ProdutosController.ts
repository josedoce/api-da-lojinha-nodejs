import {Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { PrateleiraRepository } from '../repositories/PrateleiraRepository';

class ProdutosController {
    async produtosHome(req: Request, res: Response){
        const prateleira = getCustomRepository(PrateleiraRepository);

        const produtos = await prateleira.find();

        const servirProdutos: Array<object> = [];

        produtos.forEach((produto)=>{
            const {codigo,created_at, und_disp, ...resto} = produto;
            servirProdutos.push(resto)
        });

        return res.json(servirProdutos);
    }
    async produtosPage(req: Request, res: Response){

        const prateleira = getCustomRepository(PrateleiraRepository);

        const produtos = await prateleira.find({skip: Number(req.query.page), take: 1});

        const servirProdutos: Array<object> = [];

        produtos.forEach((produto)=>{
            const {codigo,created_at, und_disp, ...resto} = produto;
            servirProdutos.push(resto)
        });

        res.json(servirProdutos);
    }
}

export default new ProdutosController();