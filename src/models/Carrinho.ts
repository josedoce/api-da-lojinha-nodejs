import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import {v4 as uuid} from 'uuid';
import { Clientes } from "./Clientes";
import { Imagens } from "./Imagens";
import { Prateleira } from "./Prateleira";

@Entity('carrinho')
class Carrinho {

    @PrimaryColumn()
    readonly id: string;
    
    @Column()
    id_produto: string;

    @Column()
    id_cliente: string;
    
    @ManyToOne(()=>Prateleira)
    @JoinColumn({name:'id_produto'})
    produto: Prateleira;

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

    @OneToMany(() => Imagens, imagens => imagens.imagens)
    @JoinColumn({name: 'id_produto'})
    img_produto: Imagens[];

    @ManyToOne(()=>Clientes, clientes=>clientes.carrinho)
    @JoinColumn({name: 'id_cliente'})
    cliente: Clientes;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
}

export {Carrinho};