import fs from 'fs';
import path from 'path';

/**
 * Qualquer mudança de pasta para esta função, recomendo reavaliar o caminho.
 */
const local: string = path.join(__dirname,'..','..','public','uploads','images');

/**
 * @param imagem string ex: ("image219282.jpg")
 * @returns (  ): boolean => true se deletar, false se não deletar.
 */
export function deleteImgs(imagem: string):boolean {
    try {
        const dados: string[] = fs.readdirSync(local);

        let achou: string = dados.find(e=>e == imagem);
        if(achou){
            fs.rmSync(path.join(local,achou));
        }else{
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}
