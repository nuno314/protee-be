import { MigrationInterface, QueryRunner } from 'typeorm';

export class LocationAddFamilyId1685848549977 implements MigrationInterface {
    name = 'LocationAddFamilyId1685848549977';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ADD "family_id" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "family_id"`);
    }
}
