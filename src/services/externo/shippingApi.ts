import { Clientes } from "../../models/Clientes";
import { Prateleira } from "../../models/Prateleira";

/*
*configure your api here
*/
export function someFreightApi(cliente: Clientes, produto: Prateleira){
    const {endereco} = cliente;
    const {formato, altura, comprimento, largura, peso, diametro} = produto;

    return 50;
}