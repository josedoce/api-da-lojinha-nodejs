import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreatePrateleira1614382722676 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'prateleira',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'codigo',
                        type: 'varchar'
                    },
                    {
                        name: 'produto',
                        type: 'varchar'
                    },
                    {
                        name:'descricao',
                        type: 'varchar'
                    },
                    {
                        name: 'preco_und',
                        type: 'number',
                        isNullable: true,
                    },
                    {
                        name: 'und_disp',
                        type: 'number',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('prateleira');
    }

}
