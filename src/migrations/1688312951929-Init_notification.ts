import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitNotification1688312951929 implements MigrationInterface {
    name = 'InitNotification1688312951929';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying, "content" character varying, "user_id" uuid NOT NULL, "family_id" uuid NOT NULL, "is_read" boolean NOT NULL, "type" character varying NOT NULL, "data" jsonb DEFAULT '{}', CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notifications"`);
    }
}
