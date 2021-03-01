import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCliente1614449484450 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'clientes',
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
                        name: 'isCliente',
                        type: 'varchar',
                        isNullable: true,
                        default: 'false',
                    },
                    {
                        name: 'cpf',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'n_cartao',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'titular',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'validade',
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
        await queryRunner.dropTable('clientes');
    }

}
