import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, OneToMany, PrimaryColumn } from "typeorm";
import {v4 as uuid }from 'uuid';
import { Prateleira } from "./Prateleira";

@Entity('vendedores')
class Vendedores{
    
    @PrimaryColumn()
    readonly id: string;
    
    @Column()
    nome: string;

    @Column()
    email: string;

    @Column()
    senha: string;

    @Column({default:'false'})
    isVendedor: string;

    @Column()
    cpf_cnpj: string;

    @Column()
    agencia: string;

    @Column()
    conta: string;

    @Column()
    titular: string;

    @Column()
    endereco: string;

    @Column()
    celular: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(()=>Prateleira, prateleira=>prateleira.vendedor,{
        cascade: ['insert','update']
    })
    @JoinColumn({name: 'id_vendedor'})
    prateleira: Prateleira[];
    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
    
}

export {Vendedores}