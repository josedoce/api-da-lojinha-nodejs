import { EntityRepository, Repository } from "typeorm";
import { Vendedores } from "../models/Vendedores";

@EntityRepository(Vendedores)
class VendedoresRepository extends Repository<Vendedores>{}

export {VendedoresRepository};