import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class ListaNegra1617122984958 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name:"lista_negra_tokens",
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true
                    },
                    {
                        name: 'token',
                        type: 'varchar'
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
