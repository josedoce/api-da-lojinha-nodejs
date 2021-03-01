import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import {v4 as uuid} from 'uuid';

@Entity('prateleira')
class Prateleira{

    @PrimaryColumn()
    readonly id: string;

    @Column()
    codigo: string;

    @Column()
    produto: string;

    @Column()
    descricao: string;

    @Column()
    preco_und: number;

    @Column()
    und_disp: number;

    @CreateDateColumn()
    created_at: Date;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
}

export {Prateleira};