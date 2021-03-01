import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import {v4 as uuid} from 'uuid';
import { Clientes } from "./Clientes";
import { Prateleira } from "./Prateleira";

@Entity('carrinho')
class Carrinho {

    @PrimaryColumn()
    readonly id: string;
    
    @Column()
    id_produto: string;
    
    @ManyToOne(()=>Prateleira)
    @JoinColumn({name:'id_produto'})
    produto: Prateleira;

    @Column()
    id_cliente: string;

    @ManyToOne(()=>Clientes)
    @JoinColumn({name:'id_cliente'})
    cliente: Clientes;

    @Column({default: 0})
    quantidade: number;
    
    @Column({default: 'false'})
    pago: string;
    
    @Column({default: 'false'})
    troca: string;
    
    @Column()
    frete: number;
    
    @Column()
    total: number;

    @CreateDateColumn()
    created_at: Date;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
}

export {Carrinho};