import {Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import { CarrinhoRepository } from '../repositories/CarrinhoRepository';
import { PrateleiraRepository } from '../repositories/PrateleiraRepository';
import * as yup from 'yup'; 

class CarrinhoController {
    async carrinho(req: Request, res: Response){
        
        const carrinho = getCustomRepository(CarrinhoRepository);
        const produtos = await carrinho.find({
            where: {id_cliente: req.usuario},
            relations: ['produto']
        });
        
        const servirProdutos: Array<object>=[];

        produtos.forEach((produtoIdx)=>{
            const {produto,...produtos} = produtoIdx;
            const mesclagem = {...produtos, ...produto};
            const {codigo,pago,troca, ...resto} = mesclagem;
            servirProdutos.push(resto)
        });

        res.status(200).json(servirProdutos);
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
        
        const existeProduto = await carrinho.findOne({where: {id_produto: produto.id, id_cliente: id}});
        
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