import { EntityRepository, Repository } from 'typeorm';
import { Administracao } from '../models/Administracao';

@EntityRepository(Administracao)
class AdministracaoRepository extends Repository<Administracao> {
    
}

export {AdministracaoRepository};