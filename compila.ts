import path from 'path';
import fs from 'fs';

const locais: Array<object> = [
    {teste:'teste'},
    {teste:'teste.txt'}
];
locais.forEach((localizacao)=>{
    const teste = localizacao;
    console.log(teste);
    // const local = path.join(__dirname, `/${localizacao}`);

    // fs.rmdir(local,(err)=>{
    //     if(err){
    //         console.log('caiu no bait mermao');
    //     }else{
    //         console.log('sucesso ao deletar');
    //     }
    // })

    // fs.rm(local,(err)=>{
    //     if(err){
    //         console.log('caiu no bait mermao');
    //     }else{
    //         console.log('sucesso ao deletar');
    //     }
    // })

})
