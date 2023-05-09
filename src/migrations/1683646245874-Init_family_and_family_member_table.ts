import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitFamilyAndFamilyMemberTable1683646245874 implements MigrationInterface {
    name = 'InitFamilyAndFamilyMemberTable1683646245874';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "family" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying NOT NULL, CONSTRAINT "PK_ba386a5a59c3de8593cda4e5626" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE TABLE "family_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "family_id" uuid NOT NULL, "user_id" uuid NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_a391876af9dee0ed209028b0176" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "family_member" ADD CONSTRAINT "FK_a3ab7bebedb95e5d5e6d0dcfa18" FOREIGN KEY ("family_id") REFERENCES "family"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "family_member" ADD CONSTRAINT "FK_5961d142ab5a90d02a73726924f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "family_member" DROP CONSTRAINT "FK_5961d142ab5a90d02a73726924f"`);
        await queryRunner.query(`ALTER TABLE "family_member" DROP CONSTRAINT "FK_a3ab7bebedb95e5d5e6d0dcfa18"`);
        await queryRunner.query(`DROP TABLE "family_member"`);
        await queryRunner.query(`DROP TABLE "family"`);
    }
}
