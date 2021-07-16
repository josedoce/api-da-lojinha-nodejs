import {Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import { CarrinhoRepository } from '../repositories/CarrinhoRepository';
import { PrateleiraRepository } from '../repositories/PrateleiraRepository';
import * as yup from 'yup'; 
import { ClientesRepository } from '../repositories/ClientesRepository';
import { Clientes } from '../models/Clientes';

import { FavoritosRepository } from '../repositories/FavoritosRepository';
import { someFreightApi } from '../services/externo/shippingApi';


class CarrinhoController {
    async carrinho(req: Request, res: Response){
        const carrinho = getCustomRepository(ClientesRepository);
        
        const produtos: Clientes[] = await carrinho.find({
            where: {id: req.usuario.id},
            relations: ['carrinho']
        });

        const {
            cpf,
            senha,
            n_cartao,
            celular,
            email,
            titular,
            validade,
            created_at,
            endereco,
            ...resto} =  produtos[0];
            
        res.status(200).json(resto);
    }
    async setCarrinho(req: Request , res: Response){
        const {id} = req.usuario;
        const {id_produto} = req.params;
        const {qtd, opcao_frete} = req.body;
        //falta a validação com o yup
        if(opcao_frete!='sedex'&&opcao_frete!='pac'){
            return res.status(400).json({opcao_frete_disponiveis: ['pac','sedex']})
        }
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

        const cliente = getCustomRepository(ClientesRepository);
        const hasCliente = await cliente.findOne({where: {id: id}});

        
        const frete:number = someFreightApi(hasCliente, produto);

        const total:number = (produto.preco_und * Number(qtd)) + (Number(qtd)*frete);

        const totalFrete = (Number(qtd)*frete);

        const carrinho = getCustomRepository(CarrinhoRepository);
        
        const existeProduto = await carrinho.findOne({where: {id_produto: produto.id, id_cliente: id}});
        
        if(existeProduto){
            existeProduto.quantidade = qtd;
            existeProduto.frete = totalFrete;
            existeProduto.total = total;
            const salvouQtd = await carrinho.save(existeProduto);
            return res.status(200).json(salvouQtd);
        }

        const salvarCarrinho = carrinho.create({
            id_cliente: String(id),
            id_produto: id_produto,
            quantidade: qtd,
            frete: totalFrete,
            total: total
        });

        const salvouCarrinho = await carrinho.save(salvarCarrinho);
        res.status(200).json(salvouCarrinho);
    }
    async addFavorito(req: Request , res: Response){
        const {id_produto} = req.params;
        const schema = yup.string().required("Um id valido é necessario.");
        try {
            await schema.validate(id_produto, {abortEarly: false});
        } catch (error) {
            return res.status(406).json(error.message);
        }

        const produto = getCustomRepository(FavoritosRepository);
        const productExists = await produto.findOne({id_produto: id_produto});
        
        if(!productExists){
            const crie = produto.create({
                id_cliente: String(req.usuario.id),
                id_produto: String(id_produto)
            })
            const salvo = await produto.save(crie);
            return res.status(201).json(salvo);
        }
        return res.status(400).json({error: "já esta nos favoritos."});
    }
    async deletarFavorito(req: Request , res: Response){
        const {id_produto} = req.params;
        const produto = getCustomRepository(FavoritosRepository);
        const productExists = await produto.findOne({id_produto: id_produto});
        
        if(productExists){
            await produto.delete({id_produto: id_produto});
            return res.status(201).json({success: "sucesso ao apagar."});
        }
        return res.status(400).json({error: "Este produto já foi apagado ou não existe em nossa base de dados."});
    }
    async verFavoritos(req: Request , res: Response){

        const produto = getCustomRepository(ClientesRepository);
        
        const {nome, favoritos} = await produto.findOne({
            where: {id: String(req.usuario.id)},
            relations: ['favoritos']
        })
        
        res.status(201).json({nome, favoritos});
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

export {CarrinhoController};
