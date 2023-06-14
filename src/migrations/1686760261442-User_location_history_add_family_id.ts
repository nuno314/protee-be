import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserLocationHistoryAddFamilyId1686760261442 implements MigrationInterface {
    name = 'UserLocationHistoryAddFamilyId1686760261442';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_location_history" ADD "family_id" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_location_history" DROP COLUMN "family_id"`);
    }
}
