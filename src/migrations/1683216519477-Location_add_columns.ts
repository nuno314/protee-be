import { MigrationInterface, QueryRunner } from 'typeorm';

export class LocationAddColumns1683216519477 implements MigrationInterface {
    name = 'LocationAddColumns1683216519477';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location" ADD "status" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "name"`);
    }
}
