
interface CreateProduct{
    name: string;
    description: string;
    price: number;
    unid_disp: number;
    peso: string;
    formato: string;
    comprimento: string;
    altura: string;
    largura: string;
    servico: string;
    diametro: string;
}

interface CreateVendedor{
    nome: string;
    email: string;
    senha: string;
}
interface LoginVendedor{
    email: string;
    senha: string;
}
export{
    CreateProduct,
    CreateVendedor,
    LoginVendedor
};