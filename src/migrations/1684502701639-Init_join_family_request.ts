import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitJoinFamilyRequest1684502701639 implements MigrationInterface {
    name = 'InitJoinFamilyRequest1684502701639';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "family_invite_code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "code" character varying NOT NULL, "family_id" character varying NOT NULL, CONSTRAINT "UQ_2c24b8d8b250bdca2c8015acd4d" UNIQUE ("code"), CONSTRAINT "UQ_c51ea0da896e8afae4ce7780a7f" UNIQUE ("family_id"), CONSTRAINT "PK_61a86da0842c17a99bc7b7a108f" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "join_family_request" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "family_id" uuid NOT NULL, "is_approved" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_92166a5e31e8bf413d60e67cef2" PRIMARY KEY ("id"))`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "join_family_request"`);
        await queryRunner.query(`DROP TABLE "family_invite_code"`);
    }
}
