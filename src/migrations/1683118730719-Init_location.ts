import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitLocation1683118730719 implements MigrationInterface {
    name = 'InitLocation1683118730719';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "lat" numeric(10,6) NOT NULL, "long" numeric(10,6) NOT NULL, "description" character varying, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "location"`);
    }
}
