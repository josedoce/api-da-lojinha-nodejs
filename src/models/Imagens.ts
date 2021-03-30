import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import {v4 as uuid} from 'uuid';
import { Prateleira } from './Prateleira';

@Entity('imagens')
class Imagens{

    @PrimaryColumn()
    readonly id: string;
    
    @Column()
    id_produto: string;

    @Column()
    link: string;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(()=>Prateleira, prateleira => prateleira.img_produto,{
        cascade: ['insert','update']
    })
    @JoinColumn({name: 'id_produto'})
    imagens: Prateleira;
    
    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
}

export {Imagens};