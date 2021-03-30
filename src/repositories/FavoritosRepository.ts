import { EntityRepository, Repository } from "typeorm";
import { Favoritos } from "../models/Favoritos";

@EntityRepository(Favoritos)
class FavoritosRepository extends Repository<Favoritos>{}
export{FavoritosRepository}