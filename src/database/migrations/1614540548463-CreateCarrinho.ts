import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateCarrinho1614540548463 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'carrinho',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true
                    },
                    {
                        name: 'id_produto',
                        type: 'uuid',
                        isNullable: false
                    },
                    {
                        name: 'id_cliente',
                        type: 'uuid',
                        isNullable: false
                    },
                    {
                        name: 'quantidade',
                        type: 'number',
                        isNullable: true
                    },
                    {
                        name: 'pago',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'troca',
                        type: 'varchar',
                        isNullable: true
                    },
                    {
                        name: 'frete',
                        type: 'number',
                        isNullable: true
                    },
                    {
                        name: 'total',
                        type: 'number',
                        isNullable: true
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ],
                foreignKeys: [
                    {
                        name: 'FKPrateleira',
                        referencedTableName: 'prateleira',
                        referencedColumnNames: ['id'],
                        columnNames: ['id_produto'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE'
                    },
                    {
                        name: 'FKCliente',
                        referencedTableName: 'clientes',
                        referencedColumnNames: ['id'],
                        columnNames: ['id_cliente'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE'
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('carrinho');
    }

}
