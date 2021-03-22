import {Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import { CarrinhoRepository } from '../repositories/CarrinhoRepository';
import { PrateleiraRepository } from '../repositories/PrateleiraRepository';
import * as yup from 'yup'; 
import { ClientesRepository } from '../repositories/ClientesRepository';

class CarrinhoController {
    async carrinho(req: Request, res: Response){
        
        const carrinho = getCustomRepository(ClientesRepository);
        const produtos = await carrinho.find({
            where: {id_cliente: req.usuario},
            relations: ['carrinho']
        });
        
        const servirProdutos: Array<object>=[];

       

        res.status(200).json(produtos);
    }
    async setCarrinho(req: Request , res: Response){
        const {id} = req.usuario;
        const {id_produto} = req.params;
        const {qtd} = req.body;
        //falta a validação
        
        const prateleira = getCustomRepository(PrateleiraRepository);
        const produto = await prateleira.findOne({
            where: {id: id_produto},
        }); 
        if(Number(qtd) < 1 || Number(qtd) > produto.und_disp){
            res.status(400).json({erro: 'A quantidade tem que ser superior a zero e inferior a quantidade me estoque.'});
        }
        if(!produto){
            return res.status(404).json({erro: 'Produto não foi encontrado.'})
        }
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
            id_cliente: String(id),
            id_produto: id_produto,
            quantidade: qtd,
            frete: frete,
            total: total
        });

        const salvouCarrinho = await carrinho.save(salvarCarrinho);
        res.status(200).json(salvouCarrinho);
    }
    async deletarCarrinho(req: Request, res: Response){
        const produto = getCustomRepository(CarrinhoRepository);
            
            const produtoExiste = await produto.find({id: req.params.id_produto});
            if(!produtoExiste[0]){
                return res.json({erro: 'O produto não foi apagado, pois provavelmente não existe.'})
            }
            produto.delete({id: req.params.id_produto}).then(()=>{
                return res.status(201).json({exito:'O produto foi apagado.'})
            })
    }
}

export default new CarrinhoController();