import { EntityRepository, Repository } from "typeorm";
import { Imagens } from "../models/Imagens";

@EntityRepository(Imagens)
class ImagensRepository extends Repository<Imagens>{}

export {ImagensRepository};