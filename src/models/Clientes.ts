import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryColumn } from "typeorm";
import {v4 as uuid }from 'uuid';
import { Carrinho } from "./Carrinho";
import { Favoritos } from "./Favoritos";

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

    @OneToMany(()=>Carrinho, carrinho=>carrinho.cliente)
    carrinho: Carrinho[];

    @OneToMany(()=>Favoritos, favoritos=>favoritos.cliente)
    @JoinColumn({name: 'id_cliente'})
    favoritos: Favoritos[];
    
    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
    
}

export {Clientes}