import {Request, Response} from 'express';
import { ImagemService } from '../services/interno/ImagemService';

class ImagemController {

    async index(req: Request, res: Response){
        
    }

    async show(req: Request, res: Response){
        
    }

    async create(req: Request, res: Response){
        const imgs:any = req.files;
       
        const {id_produto} = req.params;
        
        const imagemService = new ImagemService();

        try {
            await imagemService.create(imgs, id_produto);
        } catch (error) {
            return res.status(error.code).json(error);
        } 
    }

    async update(req: Request, res: Response){
        
    }

    async delete(req: Request, res: Response){
        const {id_produto} = req.params;
        const {images} = req.body;
        
        const imagemService = new ImagemService();
        const imgsParaDeletar: string [] = Array.isArray(images)?images:Array.of(images);
         
        try {
            await imagemService.delete(imgsParaDeletar, id_produto);           
        } catch (error) {
            return res.status(error.code).json(error);
        }
    }

}

export {ImagemController};