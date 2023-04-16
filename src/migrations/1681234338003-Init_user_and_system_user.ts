import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitUserAndSystemUser1681234338003 implements MigrationInterface {
    name = 'InitUserAndSystemUser1681234338003';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "system_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "UQ_73dff187ed765e8403bf5fc911e" UNIQUE ("email"), CONSTRAINT "PK_cd8917a46de98ec75f9197911c0" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying, "firebase_id" character varying NOT NULL, "phone_number" character varying, "email" character varying, "is_active" boolean NOT NULL DEFAULT true, "dob" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "system_users"`);
    }
}
