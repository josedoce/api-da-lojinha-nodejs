import { getCustomRepository, Repository } from 'typeorm';
import * as yup from 'yup';
import { compareHash, crieHash } from '../../gen/bcryptjs';
import { Clientes } from '../../models/Clientes';
import { ClientesRepository } from '../../repositories/ClientesRepository';

interface IUser{
    name?: string;
    email: string;
    password: string;
}

class UsuarioServices{
    private clientRepository: Repository<Clientes>;
    
    constructor(){
        this.clientRepository = getCustomRepository(ClientesRepository);
    }

    async index(){
         
    }

    async show({email, password}:IUser){
        const schema = yup.object().shape({
            email: yup.string().email('Um email valido é necessário.').required('É necessario um email para login'),
            password: yup.string().required('Uma senha com pelo menos 8 caracteres é necessaria.').min(8,'senha tem que ter pelo menos 8 caracteres').max(32, 'o tamanho da senha se limita a 32 caracteres')
        });
        try {
            await schema.validate({email, password}, {abortEarly: false});
        } catch (error) {
            throw {
                error:'Algum dado foi omitido.',
                code: 400
            };
        }
        const userExists = await this.clientRepository.findOne({email});
        if(!userExists){
            throw {
                error: 'usuario não existe ou o email está errado.',
                code: 400
            };
        }
        if(!compareHash(password, userExists.senha)){
            throw {
                error: 'a senha está incorreta.',
                code: 400
            };
        }

        return userExists;
    }

    async create({name,email,password}:IUser){
        
        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
            password: yup.string().required().min(8).max(32),
        });
        
        try {
            await schema.validate({name, email, password}, {abortEarly: false});
        } catch (error) {
            throw {
                error:'Algum dado foi omitido.',
                code: 400
            };
        }
        const userExists = await this.clientRepository.findOne({email});
        
        if(userExists){
            throw {
                error:'usuário já existe, tente logar ou criar um usuário.',
                code: 400
            };
        }

        const userCreate = this.clientRepository.create({
            nome: name,
            email: email,
            senha: crieHash(password)
        });

        const userSave = await this.clientRepository.save(userCreate);
        if(!userSave){
            throw {
                error: 'usuario não foi salvo.',
                code: 500
            };
        }

        return userSave;           
    }

    async update(){

    }

    async delete(){
        
    }

};
export {UsuarioServices};