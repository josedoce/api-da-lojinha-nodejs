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
                        name: 'id_vendedor',
                        type: 'uuid',
                        default: false
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
                        name: 'peso',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'formato',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'comprimento',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'altura',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'largura',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'servico',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'diametro',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'aprovado',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    }
                ],
                foreignKeys: [
                    {
                        name: 'FKVendedores',
                        referencedTableName: 'vendedores',
                        referencedColumnNames: ['id'],
                        columnNames: ['id_vendedor'],
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE'
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('prateleira');
    }

}
