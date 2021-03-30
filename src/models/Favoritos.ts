import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import {v4 as uuid} from 'uuid';
import { Clientes } from "./Clientes";
import { Prateleira } from "./Prateleira";

@Entity('favoritos')
class Favoritos{

    @PrimaryColumn()
    id:string;

    @Column()
    id_produto:string;

    @Column()
    id_cliente:string;

    @ManyToOne(()=>Clientes, cliente=>cliente.favoritos)
    @JoinColumn({name: 'id_cliente'})
    cliente: Clientes;

    @CreateDateColumn()
    created_at:Date;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
}

export {Favoritos}