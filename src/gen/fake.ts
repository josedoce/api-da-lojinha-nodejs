import { getCustomRepository } from 'typeorm';
import { PrateleiraRepository } from '../repositories/PrateleiraRepository';
import {v4 as uuid} from 'uuid';
import faker from 'faker/locale/pt_BR';

const algunsProdutos = getCustomRepository(PrateleiraRepository);
export function gerarProdutos(vezes: number, vendedor: string, setdb: boolean = true){
    for(let i = 0; i < vezes; i++){
        const salveProduto = algunsProdutos.create({
            id_vendedor: vendedor,
            codigo: uuid(),
            produto: faker.commerce.productName(),
            descricao: faker.commerce.productDescription(),
            preco_und: Number(faker.commerce.price()),
            und_disp: Math.trunc(Math.random()*30),
            peso: (Math.random()*2).toPrecision(3),
            formato: '1',
            comprimento: String(Math.trunc(Math.random()*30)),
            altura: String(Math.trunc(Math.random()*30)),
            largura: String(Math.trunc(Math.random()*30)),
            servico: '1,3',
            diametro: 'null'
        });
        algunsProdutos.save(salveProduto);
    }
}
