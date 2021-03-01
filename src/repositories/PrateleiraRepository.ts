import { EntityRepository, Repository } from "typeorm";
import { Prateleira } from "../models/Prateleira";

@EntityRepository(Prateleira)
class PrateleiraRepository extends Repository<Prateleira>{

}

export {PrateleiraRepository};