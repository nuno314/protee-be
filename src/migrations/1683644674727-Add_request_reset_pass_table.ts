import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRequestResetPassTable1683644674727 implements MigrationInterface {
    name = 'AddRequestResetPassTable1683644674727';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "reset_password_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "email" character varying NOT NULL, "key" character varying, "user_id" character varying NOT NULL, CONSTRAINT "UQ_b70d8d05dc53bbec3e7336b94c4" UNIQUE ("email"), CONSTRAINT "UQ_f607e0ffa29c4a1446c0a372f55" UNIQUE ("key"), CONSTRAINT "PK_74675f940551b34f6e321247b81" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "reset_password_request"`);
    }
}
