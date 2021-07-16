import {Request, Response} from 'express';
import { ImagemService } from '../services/interno/ImagemService';
import { ProdutoServices } from '../services/interno/ProdutoService';

class ProdutosController {
    /**
     * Esta classe é responsavel pelos produtos, mas tambem consome outros services
     * como " class ImagemService " e " class ProdutoService ", ambas em ./src/services/interno/
     */
    constructor(){}
    async index(req: Request, res: Response){
        //validação é necessaria.
        const access = new ProdutoServices();
        try {
            const {proximo,produtos} = await access.index(req, res);
            return res.status(302).json({proximo, produtos});
        } catch (error) {
            return res.status(error.code).json(error);
        }
    }

    async show(req: Request, res: Response){
        const {id} = req.params;
        const access = new ProdutoServices();
        try {
            const {produto} = await access.show(id);
            const {vendedor, ...resto} = produto;
            const {nome} = vendedor;
            return res.status(302).json({produto: resto, vendedor: nome});
        } catch (error) {
            return res.status(error.code).json(error);
        }
    }

    async create(req: Request, res: Response){
        const {...salve} = req.body;
        const access = new ProdutoServices();
        try {
            const dados = await access.create(salve, String(req.usuario.id));
            return res.status(200).json(dados);
        } catch (error) {
            return res.status(error.code).json(error.message);
        }
    }

    async update(req: Request, res: Response){
        const {id_produto} = req.params;
        const {...salve} = req.body;
       
        const produtoService = new ProdutoServices();
        
        try {
            await produtoService.update(salve, id_produto); 
        } catch (error) {
            return res.status(error.code).json({status: error.message});
        }
    }

    async delete(req: Request, res: Response){
        const {id_produto} = req.params;
        const access = new ProdutoServices();
        try {
            await access.delete(id_produto);
        } catch (error) {
            return res.status(error.code).json({message: error.message});
        }
    }

}

export {ProdutosController};
