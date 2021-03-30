import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Favoritos1616629645553 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'favoritos',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'id_produto',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'id_cliente',
                        type: 'uuid',
                        isNullable: false
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ],
                foreignKeys: [
                    {
                        name: 'FKFavoritos',
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
    }

}
