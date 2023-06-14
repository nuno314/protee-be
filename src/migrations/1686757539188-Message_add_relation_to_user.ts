import { MigrationInterface, QueryRunner } from 'typeorm';

export class MessageAddRelationToUser1686757539188 implements MigrationInterface {
    name = 'MessageAddRelationToUser1686757539188';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "message" ADD CONSTRAINT "FK_6dba64e650488c2002acf3fd18a" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_6dba64e650488c2002acf3fd18a"`);
    }
}
