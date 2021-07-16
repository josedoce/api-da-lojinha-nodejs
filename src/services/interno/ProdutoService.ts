import { getCustomRepository, Repository } from "typeorm";
import * as yup from 'yup';
import { Prateleira } from "../../models/Prateleira";
import { PrateleiraRepository } from "../../repositories/PrateleiraRepository";
import { CreateProduct } from "../../tipagem";
import { AppError } from "../../errors/AppError";
import {v4 as uuid} from 'uuid';
import { ImagemService } from "./ImagemService";
import { Imagens } from "../../models/Imagens";
import { ImagensRepository } from "../../repositories/ImagensRepository";
import { Request, Response } from "express";

interface IndexProducts{
    proximo: boolean;
    produtos: Prateleira[];
}
interface IndexProduct{
    produto: Prateleira;
}

class ProdutoServices{

    private produtosRepository: Repository<Prateleira>;
    private imagemRepository: Repository<Imagens>;

    constructor(){
        this.produtosRepository = getCustomRepository(PrateleiraRepository);
        this.imagemRepository = getCustomRepository(ImagensRepository);
    }

    async index(req:Request, res:Response):Promise<IndexProducts>{
        const page = req.params.page;
        let privada = false;
        if(req.route.path === '/produto/auth/produtos/:page'){
            privada = true;
        }
        const schema = yup.number().lessThan(9999,"limitado a 9999 indices");
        
        try {            
            await schema.validate(page, {abortEarly: false});
        } catch (error) {
            throw {
                error,
                code: 400
            };
        }

        let offset:number = 0;
        let itensPorPagina:number = 10;
        if(Number(page)==1){
            offset = 0;
        }else{
            offset = (Number(page)-1) * itensPorPagina;
        }

        let produtos: Prateleira[] = [];
        if(privada){
            produtos = await this.produtosRepository.find({
                where: {id_vendedor: req.usuario.id},
                skip: offset, 
                take: itensPorPagina,
                order: {created_at: 'DESC'}
            });
        }else if(!privada){
            produtos = await this.produtosRepository.find({
                skip: offset, 
                take: itensPorPagina,
                order: {created_at: 'DESC'}
            });
        }
        if(produtos.length === 0){
            throw new AppError('Nenhum indice foi encontrado.', 400);
        }
        let proximo:boolean;
        if(offset + itensPorPagina >= await this.produtosRepository.count()){
            proximo = false;
        }else{
            proximo = true;
        }
        return {proximo, produtos};
    }

    async show(id:string|number):Promise<IndexProduct>{
        const schema = yup.string().required("um id é necessario!");
        try {            
            await schema.validate(id, {abortEarly: false});
        } catch (error) {
            throw {
                error,
                code: 400
            };
        }
        const produto = await this.produtosRepository.findOne({
            where: { id: id },
             relations: ['img_produto','vendedor']
         });
        if(!produto){
            throw{
                error: 'Indice não encontrado',
                code: 404
            }
        }
        
        return {produto};
    }

    async create(produtos: CreateProduct, id_usuario: string){
        const { 
            name, description, unid_disp, price,
            peso, formato, comprimento, altura,
            largura, servico, diametro,
        }:CreateProduct = produtos;
        
        const schema = yup.object().shape({
            name: yup.string().required(),
            description: yup.string().required(),
            price: yup.number().required(),
            unid_disp: yup.number().required(),
            peso: yup.string().required(),
            formato: yup.string().required(),
            comprimento: yup.string().required(),
            altura: yup.string().required(),
            largura: yup.string().required(),
            servico: yup.string().required(),
            diametro: yup.string().required(),
        });

        try {
            await schema.validate(produtos, {abortEarly: false});
        } catch (error) {
            throw new AppError('Alguns dados foram omitidos.', 400);
        }

        const algunsProdutos = getCustomRepository(PrateleiraRepository);
        
        const salveProduto = algunsProdutos.create({
            id_vendedor: id_usuario,
            codigo: uuid(),
            produto: name,
            descricao: description,
            preco_und: price,
            und_disp: unid_disp,
            peso: peso,
            formato: formato,
            comprimento: comprimento,
            altura: altura,
            largura: largura,
            servico: servico,
            diametro: diametro,
        });
        
        await algunsProdutos.save(salveProduto);
    
        return salveProduto;
    }

    async update(salve: object, id_produto: string){
        //edição de produto
        const schema = yup.object().shape({
            name: yup.string().optional(),
            description: yup.string().optional(),
            price: yup.number().optional(),
            unid_disp: yup.number().optional(),
            peso: yup.string().optional(),
            formato: yup.string().optional(),
            comprimento: yup.string().optional(),
            altura: yup.string().optional(),
            largura: yup.string().optional(),
            servico: yup.string().optional(),
            diametro: yup.string().optional(),
        });

        try {
            await schema.validate(salve, {abortEarly: false});
        } catch (error) {
            throw new AppError('Alguma propriedade do objeto foi negado.', 400);
        }
        const edicaoSalva = await this.produtosRepository.update(id_produto, salve);
        if(!edicaoSalva){
            throw {
                code: 403,
                message: "O produto não foi editado."
            };
        }
        throw {
            code: 200,
            message: "O produto foi editado.",
            data: edicaoSalva
        };
        //edição de produto 
    }

    async delete(id_produto: string){
        const schema = yup.string().required();
        try {
            await schema.validate(id_produto, {abortEarly: false});
        } catch (error) {
            throw new AppError("Erro, necessita de um id para deletar.", 400);
        }
        const imagemService = new ImagemService();
        const dados = await this.imagemRepository.find({id_produto});
        if(dados.length == 0){
            throw new AppError("Produto não foi encontrado.",400);
        }
        const dadosFiltrados = dados.map(e=>e.id);
        await imagemService.delete(dadosFiltrados, id_produto);
    }

};

export {ProdutoServices};