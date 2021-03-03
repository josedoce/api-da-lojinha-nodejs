import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import {v4 as uuid} from 'uuid';

@Entity('administradores')
class Administracao {
    
    @PrimaryColumn()
    readonly id: string;

    @Column()
    nome: string;

    @Column()
    email: string;

    @Column()
    senha: string;

    @Column()
    tipo: string;

    @Column()
    setor: string;

    @CreateDateColumn()
    created_at: Date;

    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }

}

export {Administracao};