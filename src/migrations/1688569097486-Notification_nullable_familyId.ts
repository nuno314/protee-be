import { MigrationInterface, QueryRunner } from 'typeorm';

export class NotificationNullableFamilyId1688569097486 implements MigrationInterface {
    name = 'NotificationNullableFamilyId1688569097486';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "family_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "family_id" SET NOT NULL`);
    }
}
