import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Imagens1614737367921 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "imagens",
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true
                    },
                    {
                        name: 'id_produto',
                        type: 'uuid',
                        default: false,
                    },
                    {
                        name: 'link',
                        type: 'varchar',
                        default: true
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
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('imagens');
    }

}
