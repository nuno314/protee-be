import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationJoinRequestWUser1685554030827 implements MigrationInterface {
    name = 'AddRelationJoinRequestWUser1685554030827';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "join_family_request" ADD CONSTRAINT "FK_5d01d9dab41af3a57844d16315f" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "join_family_request" DROP CONSTRAINT "FK_5d01d9dab41af3a57844d16315f"`);
    }
}
