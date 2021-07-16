import { AbstractRepository, EntityRepository, Repository } from "typeorm";
import { Clientes } from "../models/Clientes";
import { IRepositories } from "./IRepositories";

@EntityRepository(Clientes)
class ClientesRepository extends Repository<Clientes> implements IRepositories
{
    async getFavoritos(id:string, getCliente:boolean=false){
        let condicao ={
            where: {id: id},
        }
        condicao = getCliente?Object.assign(condicao, {relations: ['favoritos']}):condicao;
        return await this.findOne(condicao);
    }

    /**
     * passou
     */
    async getAll():Promise<Clientes[]>
    {
        return await this.find();
    }
    
    async getPerId(id:string|number, relacao:string[] = []):Promise<Clientes>
    {

        return await this.findOne(id,{relations: ['favoritos','carrinho.img_produto']});
    }

    async store(body: object): Promise<Clientes>
    {
        const data = this.create(body);
        return this.save(data);
    }

    async setUpdate(body: object, id: string|number): Promise<Clientes>
    {
        const data = await this.findOne(id);
        if(!data){
            return await this.save(body);
        }else{
            return null;
        }
    }
    async makeDelete(id): Promise<boolean>
    {
        const data = await this.findOne(id);
        if(!data){
            await this.delete(id);
            return true; 
        }else{
            return null;
        }
    }
}
export {ClientesRepository};