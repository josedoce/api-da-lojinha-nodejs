import {Request, Response} from 'express';
import { Connection, ConnectionManager, getCustomRepository, getRepository } from 'typeorm';
import { CarrinhoRepository } from '../repositories/CarrinhoRepository';
import { PrateleiraRepository } from '../repositories/PrateleiraRepository';
import * as yup from 'yup'; 
import { ClientesRepository } from '../repositories/ClientesRepository';
import { Clientes } from '../models/Clientes';
import {calcularPrecoPrazo, CEPResposta, PrecoPrazo, getServico, consultarCep as pegaCep} from '../services/CorreioBrasilApi';
import { RespostaFretePrazo } from '../tipagem';
import { Favoritos } from '../models/Favoritos';
import { FavoritosRepository } from '../repositories/FavoritosRepository';


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
        const hasCliente = await cliente.find({where: {id: id}});

        
        const entrega:PrecoPrazo = { 
            sCepOrigem:  "14403-471",
            sCepDestino:  hasCliente[0].endereco.split(',')[5],
            nVlPeso:  produto.peso.split('kg').join(''),
            nCdFormato:  produto.formato,
            nVlComprimento:  produto.comprimento,
            nVlAltura:  produto.altura,
            nVlLargura:  produto.largura,
            nCdServico:  produto.servico.split(','), //Array com os códigos de serviço
            nVlDiametro: produto.diametro == 'null'?'0':produto.diametro,
        }

        const frete1 = Object.values(await calcularPrecoPrazo(entrega));
        const escolha = getServico(opcao_frete)
        const qualFrete = frete1.find((e: RespostaFretePrazo)=> e.Codigo == escolha.codigo)

        const frete:number = Number(qualFrete['ValorSemAdicionais'].split(',').join(''));//logo usarei uma api

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
        
        const produto = getRepository(Favoritos);
        const crie = produto.create({
            id_cliente: 'e0b7d584-9b41-4102-8352-cceb56846b28',
            id_produto: '2777a5ec-47f2-4e97-91af-59b15241d1ab'
        })
        const salvo = await produto.save(crie);

        res.status(201).json(salvo)
    }
    async deletarFavorito(req: Request , res: Response){

    }
    async verFavoritos(req: Request , res: Response){

        const produto = getCustomRepository(ClientesRepository);
        const achou = await produto.getFavoritos(String(req.usuario.id), false);
        
        res.status(201).json(achou);
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

function consultarCep(arg0: string) {
    throw new Error('Function not implemented.');
}
