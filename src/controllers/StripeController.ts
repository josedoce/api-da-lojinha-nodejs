import { Request, Response } from 'express';
import Stripe from '../services/StripeApi';
import * as yup from 'yup';
import { getCustomRepository } from 'typeorm';
import { PrateleiraRepository } from '../repositories/PrateleiraRepository';

class StripeController{
    
    async criarProduto(req: Request, res: Response){
        const { name, description, unid_disp, price } = req.body;
        
        const schema = yup.object().shape({
            name: yup.string().required("O produto precisa de nome!"),
            description: yup.string().required("O produto precisa de uma descrição!"),
            price: yup.number().required('O produto precisa de preço.'),
            unid_disp: yup.number().required('A quantidade é necessaria.')
        });

        try {
            await schema.validate(req.body, {abortEarly: false});
        } catch (error) {
            return res.status(400).json({error: error})
        }

        const crieProduto = await Stripe.products.create({
            name
        });
        
        const preco = await Stripe.prices.create({
                unit_amount: Number(price),
                currency: 'brl',
                product: crieProduto.id
        });
        
        const produto = getCustomRepository(PrateleiraRepository);
        
        const salveProduto = produto.create({
            codigo: preco.id,
            produto: crieProduto.name,
            descricao: description,
            preco_und: preco.unit_amount,
            und_disp: unid_disp
        });
        
        await produto.save(salveProduto);

        return res.status(201).json(salveProduto);

    }

    async pagar(req: Request, res: Response){
        return res.render('pagar');
    }

    async cobrar(req: Request, res: Response){
        // const {id} = req.params;
    
        // const cobrar = await Stripe.charges.create({
        //     amount:  1000,
        //     currency: 'brl',
        // });
        // return res.send(cobrar);
    }

}

export default new StripeController();