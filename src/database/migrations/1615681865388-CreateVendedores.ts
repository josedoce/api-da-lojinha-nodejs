import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateVendedores1615681865388 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'vendedores',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'nome',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'senha',
                        type: 'varchar',
                        isNullable: false
                    },
                    {
                        name: 'isVendedor',
                        type: 'varchar',
                        isNullable: true,
                        default: 'false',
                    },
                    {
                        name: 'cpf_cnpj',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'agencia',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'conta',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'titular',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'endereco',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'celular',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('vendedores');
    }

}
