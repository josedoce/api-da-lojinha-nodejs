import { AbstractRepository, EntityRepository, Repository } from "typeorm";
import { Clientes } from "../models/Clientes";

@EntityRepository(Clientes)
class ClientesRepository extends Repository<Clientes>{
    
    async getFavoritos(id:string, getCliente:boolean=false){
        let condicao ={
            where: {id: id},
        }
        condicao = getCliente?Object.assign(condicao, {relations: ['favoritos']}):condicao;
        return await this.findOne(condicao);
    }
    
}
export {ClientesRepository};