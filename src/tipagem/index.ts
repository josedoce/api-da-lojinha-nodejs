interface CreateProduct {
    name: string;
    description: string;
    unid_disp: number;
    price: number;
    peso:string;
    formato:string;
    comprimento:string;
    altura:string;
    largura:string;
    servico:string;
    diametro:string;
}

interface RespostaFretePrazo{
    Codigo: string,
    Valor: string,
    PrazoEntrega: string,
    ValorSemAdicionais: string,
    ValorMaoPropria: string,
    ValorAvisoRecebimento: string,
    ValorDeclarado: string,
    EntregaDomiciliar: string,
    EntregaSabado: string,
    obsFim: string|undefined,
    Erro: string,
    MsgErro: string|undefined
}

export{CreateProduct, RespostaFretePrazo};