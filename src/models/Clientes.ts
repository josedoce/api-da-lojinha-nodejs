import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from "typeorm";
import {v4 as uuid }from 'uuid';

@Entity('clientes')
class Clientes{
    @PrimaryColumn()
    readonly id: string;

    @Column()
    nome: string;

    @Column()
    email: string;

    @Column()
    senha: string;

    @Column({default:'false'})
    isCliente: string;

    @Column()
    cpf: string;

    @Column()
    n_cartao: string;

    @Column()
    titular: string;

    @Column()
    validade: string;

    @Column()
    endereco: string;

    @Column()
    celular: string;

    @CreateDateColumn()
    created_at: Date;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
    
}

export {Clientes}