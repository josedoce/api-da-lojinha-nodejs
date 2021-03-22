import { EntityRepository, Repository } from "typeorm";
import { Carrinho } from "../models/Carrinho";

@EntityRepository(Carrinho)
class CarrinhoRepository extends Repository<Carrinho>{}

export {CarrinhoRepository};