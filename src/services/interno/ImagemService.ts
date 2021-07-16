import { getCustomRepository, Repository } from "typeorm";
import { deleteImgs } from "../../gen/deleteImgs";
import { Imagens } from "../../models/Imagens";
import { ImagensRepository } from "../../repositories/ImagensRepository";

class ImagemService{
    private imagemRepository: Repository<Imagens>;
    
    constructor(){
        this.imagemRepository = getCustomRepository(ImagensRepository);
    }

    async index(){
        
    }

    async show(){

    }

    async create(imgs: any[], id_produto: string){
        const contagem = await this.imagemRepository.find({id_produto: id_produto});
        //adição de imagens ao banco de dados.
        if(contagem.length <= 9 && imgs.length<=9){
            imgs.forEach(async(img:Express.Multer.File)=>{
                const save = this.imagemRepository.create({
                    id_produto: id_produto,
                    link: img.filename 
                });
                await this.imagemRepository.save(save);
            });
            throw {
                code: 200,
                message: "salvo com sucesso."
            };
        }else{
            throw {
                code: 400,
                message: "O limite de imagens é 10, exclua e adicione outras no lugar."
            }
        }
        //adição de imagens ao banco de dados.
    }

    async update(){

    }

    async delete(imgsParaDeletar: string[], id_produto: string){
         //delete de imagem
         if(imgsParaDeletar[0]!=undefined){
            const imagens = await this.imagemRepository.find({id_produto:id_produto});
            if(imagens.length>0){
                imgsParaDeletar.forEach(async(e,i,arr)=>{
                    const achou = imagens.find(f=>f.id == e);
                    if(achou){
                        //se deu match, a foto será procurada e deletada.
                        const deletado = deleteImgs(achou.link);
                        if(deletado){
                            //se for deletado:
                            await this.imagemRepository.delete({id: e});
                        }
                    }
                });
                throw {
                    code: 200,
                    message: "Deu certo :)."
                };
            }else{
                throw {
                    code: 400,
                    message: "Não existem arquivos de midia para esse produto."
                };
            }                
        };
        //delete de imagem
    }
};
export {ImagemService};

