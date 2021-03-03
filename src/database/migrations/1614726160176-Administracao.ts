import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Administracao1614726160176 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'administradores',
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
                        name: 'tipo',
                        type: 'varchar',
                        isNullable: true,
                        default: 'false',
                    },
                    {
                        name: 'setor',
                        type: 'varchar',
                        isNullable: true,
                        default: 'false',
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
        await queryRunner.dropTable('administradores');
    }

}
