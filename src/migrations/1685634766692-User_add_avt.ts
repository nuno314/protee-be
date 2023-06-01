import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAddAvt1685634766692 implements MigrationInterface {
    name = 'UserAddAvt1685634766692';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avt" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avt"`);
    }
}
