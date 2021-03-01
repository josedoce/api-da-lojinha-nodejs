import { EntityRepository, Repository } from "typeorm";
import { Clientes } from "../models/Clientes";

@EntityRepository(Clientes)
class ClientesRepository extends Repository<Clientes>{

}
export {ClientesRepository};