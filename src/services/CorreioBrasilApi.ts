import { CEPResposta, PrecoPrazo, PrecoPrazoResposta} from "correios-brasil";
const {consultarCep, calcularPrecoPrazo} = require("correios-brasil");

enum Formato{
    CAIXA_PACOTE = "1",
    ROLO_PRISMA = "2",
    ENVELOPE = "3"
}

enum codigoServico {
    SEDEX_A_VISTA = "04014",
    SEDEX_A_VISTA_PAGAMENTO_NA_ENTREGA = "04065",
    PAC_A_VISTA = "04510",
    PAC_A_VISTA_PAGAMENTO_NA_ENTREGA = "04707",
    SEDEX12_A_VISTA_E_A_FATURAR = "40169",
    SEDEX_10_A_VISTA_E_A_FATURAR = "40215",
    SEDEX_HOJE_VAREJO = "40290"
}
const getServico = (cod: string):{detalhe: string, codigo:string}=> {
    switch (cod) {
        case 'sedex'||codigoServico.SEDEX_A_VISTA:
            return {
                detalhe: 'Sedex a vista',
                codigo: codigoServico.SEDEX_A_VISTA
            };
       
        case 'pac'||codigoServico.PAC_A_VISTA:
            return {
                detalhe: 'Pac a vista',
                codigo: codigoServico.PAC_A_VISTA
            };
        default:
            return {
                detalhe: 'Codigo não bate com nenhuma alternativa.',
                codigo: '"'+cod+'" não existe'
            };
    }
}
export {Formato, codigoServico,
        consultarCep, calcularPrecoPrazo,
        CEPResposta, PrecoPrazo, PrecoPrazoResposta, getServico};
