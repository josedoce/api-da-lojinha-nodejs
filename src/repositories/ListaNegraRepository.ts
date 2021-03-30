import { EntityRepository, Repository } from "typeorm";
import { ListaNegra } from "../models/ListaNegra";

@EntityRepository(ListaNegra)
class ListaNegraRepository extends Repository<ListaNegra>{
    
}

export {ListaNegraRepository}