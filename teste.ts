import fs from 'fs';
import path from 'path';

const local = path.join(__dirname,'public','uploads','images');

const deleteimg = "imagem1620581063312.jpg";
function deletarImagens(imagem: string):boolean{
    try {
        const dados = fs.readdirSync(local);
   
            let achou = dados.find(e=>e == imagem);
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
console.log(deletarImagens(deleteimg));