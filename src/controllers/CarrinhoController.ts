import {Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import { CarrinhoRepository } from '../repositories/CarrinhoRepository';
import { PrateleiraRepository } from '../repositories/PrateleiraRepository';
import * as yup from 'yup'; 

class CarrinhoController {
    async carrinho(req: Request, res: Response){
        
        
        res.status(200).json({eita: 'chegamos'});
        
    }
    async setCarrinho(req: Request, res: Response){
        const {id} = req.usuario;
        const {id_produto} = req.params;
        const {qtd} = req.body;
        //falta a validação

        const prateleira = getCustomRepository(PrateleiraRepository);
        const produto = await prateleira.findOne({
            where: {id: id_produto},
        }); 

        const frete:number = 1200;//logo usarei uma api

        const total:number = produto.preco_und * Number(qtd) + frete;

        const carrinho = getCustomRepository(CarrinhoRepository);
        
        const existeProduto = await carrinho.findOne({where: {id_produto: produto.id}});
        
        if(existeProduto){
            existeProduto.quantidade = qtd;
            existeProduto.frete = frete;
            existeProduto.total = total;
            const salvouQtd = await carrinho.save(existeProduto);
            return res.status(200).json(salvouQtd);
        }

        const salvarCarrinho = carrinho.create({
            id_cliente: id,
            id_produto: id_produto,
            quantidade: qtd,
            frete: frete,
            total: total
        });

        const salvouCarrinho = await carrinho.save(salvarCarrinho);
        res.status(200).json(salvouCarrinho);
    }
}

export default new CarrinhoController();