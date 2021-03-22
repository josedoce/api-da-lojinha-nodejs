import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import {v4 as uuid} from 'uuid';
import { Imagens } from './Imagens';
import { Vendedores } from './Vendedores';


@Entity('prateleira')
class Prateleira{

    @PrimaryColumn()
    readonly id: string;

    @Column()
    id_vendedor: string;

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

    @Column()
    peso: string;
    
    @Column()
    formato: string;
    
    @Column()
    comprimento: string;
    
    @Column()
    altura: string;
    
    @Column()
    largura: string;
    
    @Column()
    servico: string;
    
    @Column()
    diametro: string;

    @Column({default: 'false'})
    aprovado: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Imagens, imagens => imagens.imagens)
    @JoinColumn({name: 'id_produto'})
    img_produto: Imagens[];

    @ManyToOne(() => Vendedores, vendedores => vendedores.prateleira)
    @JoinColumn({name: 'id_vendedor'})
    vendedor: Vendedores;
    
    constructor(){
        if(!this.id){
            this.id = uuid();
        }
    }
}

export {Prateleira};