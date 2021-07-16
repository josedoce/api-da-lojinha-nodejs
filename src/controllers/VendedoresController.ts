import { Request, Response, Express } from 'express';
import * as yup from 'yup';
import {v4 as uuid} from 'uuid';
import { FindOperator, getCustomRepository } from 'typeorm';
import { PrateleiraRepository } from '../repositories/PrateleiraRepository';
import {CreateProduct, CreateVendedor, LoginVendedor} from '../tipagem/index';
import {crieHash, compareHash} from '../gen/bcryptjs';
import jwt from 'jsonwebtoken';
import { VendedoresRepository } from '../repositories/VendedoresRepository';
import { VendedorServices } from '../services/interno/VendedorServices';
import { ImagensRepository } from '../repositories/ImagensRepository';
import { deleteImgs } from '../gen/deleteImgs';
import { ImagemService } from '../services/interno/ImagemService';
import { ProdutoServices } from '../services/interno/ProdutoService';
import { AppError } from '../errors/AppError';


const chave = process.env.JWT_SECRET_SEVER_TOKEN;
const expiracao = process.env.JWT_TOKEN_EXPIRATION;

class VendedoresController{

    async index(req: Request, res: Response){
        
    }

    async show(req: Request, res: Response){
        const dados = req.body as LoginVendedor;
        const vendedorService = new VendedorServices();
        const schema = yup.object().shape({
            email: yup.string().email('Um email valido é necessário.').required('É necessario um email para login'),
            senha: yup.string().required('Uma senha com pelo menos 8 caracteres é necessaria.').min(8,'senha tem que ter pelo menos 8 caracteres').max(32, 'o tamanho da senha se limita a 32 caracteres')
        }); 
        try {
            await schema.validate(req.body, {abortEarly: false});
            await vendedorService.show(res, dados);
        } catch (error) {
            return res.status(400).json({error: error});
        }
    }

    async create(req: Request, res: Response){
        const dados = req.body as CreateVendedor;
        const vendedorService = new VendedorServices();
        const schema = yup.object().shape({
            nome: yup.string().required(),
            email: yup.string().email().required(),
            senha: yup.string().required().min(8).max(32)
        });
        try {
            await schema.validate(dados, {abortEarly: false});
            await vendedorService.create(res, dados);
        } catch (error) {
            return res.status(400).json({error: "Não foi possivel criar usuario."});
        }
    }

    async update(req: Request, res: Response){
        const {id} = req.usuario;
        const vendedorService = new VendedorServices();
        try {
            const dados = await vendedorService.update(String(id),req.body);
            return res.status(200).json(dados);
        } catch (error) {
            return res.status(error.code).json({status: error.message});
        }
    }

    async delete(req: Request, res: Response){
        const {id} = req.usuario;
        const {id_vendedor} = req.params;
        const vendedorService = new VendedorServices();
        try {
            if(id !== id_vendedor){
                throw new AppError('Há convergencias.',400);
            }
            const dados = await vendedorService.delete(String(id));
            return res.status(200).json({status: dados});
        } catch (error) {
            return res.status(error.code).json({status: error.message});
        }
    }

}

export {VendedoresController};