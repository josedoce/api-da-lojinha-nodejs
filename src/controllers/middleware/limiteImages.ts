import { NextFunction, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { ImagensRepository } from '../../repositories/ImagensRepository';

export const limiteImages = async (req: Request, res: Response, next: NextFunction) => {
    const {id_produto} = req.params;
    const images = getCustomRepository(ImagensRepository);
    const contagem = await images.count({where: {id_produto}});
    if(contagem === 10){
        return res.status(400).json({
            code: 400,
            message: 'O numero de imagens por produto não deve superar 10.'
        })
    }
    next();
}