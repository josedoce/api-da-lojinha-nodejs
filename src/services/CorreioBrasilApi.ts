import { CEPResposta, PrecoPrazo} from "correios-brasil";
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

const entrega:PrecoPrazo = { 
    sCepOrigem:  "14403-471",
    sCepDestino:  "51275-210",
    nVlPeso:  "1",
    nCdFormato:  Formato.CAIXA_PACOTE,
    nVlComprimento:  "20",
    nVlAltura:  "20",
    nVlLargura:  "20",
    nCdServico:  [
        codigoServico.SEDEX_A_VISTA,
        codigoServico.PAC_A_VISTA
    ], //Array com os códigos de serviço
    nVlDiametro:  "0",
}

const cepExiste = (cep:string)=>{
    let t;
    function setT(r){
        t = r;
    }
    consultarCep(cep).then((r: CEPResposta)=>{
        setT("eae, corno");
        return true;
    }).catch(()=>{
        return false;
    });
    return t;
}
//console.log(cepExiste(cep))
// calcularPrecoPrazo(entrega).then((r: PrecoPrazo)=>{
//     console.log(r)
// })


export {};