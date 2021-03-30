import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import {v4 as uuid} from 'uuid';

@Entity('lista_negra_tokens')
class ListaNegra{

    @PrimaryColumn()
    id: string;

    @Column()
    token: string;

    @CreateDateColumn()
    createdAt: Date;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
}

export {ListaNegra}