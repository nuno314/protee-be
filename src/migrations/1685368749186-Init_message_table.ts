import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMessageTable1685368749186 implements MigrationInterface {
    name = 'InitMessageTable1685368749186';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "seen_by" text, "content" character varying NOT NULL, "family_id" uuid NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "message" ADD CONSTRAINT "FK_b00c22a7b799596b2b6870b88e7" FOREIGN KEY ("family_id") REFERENCES "family"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_b00c22a7b799596b2b6870b88e7"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }
}
