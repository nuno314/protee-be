import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitLocationAccessHistory1686589282789 implements MigrationInterface {
    name = 'InitLocationAccessHistory1686589282789';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "location_access_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid, "location_id" uuid, "distance" integer NOT NULL, "current_lat" numeric(10,6) NOT NULL, "current_long" numeric(10,6) NOT NULL, CONSTRAINT "PK_0c789ac6d3751a7ce83439c20f5" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `ALTER TABLE "location_access_history" ADD CONSTRAINT "FK_2c42fc1b47e25d12eb803d25363" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location_access_history" DROP CONSTRAINT "FK_2c42fc1b47e25d12eb803d25363"`);
        await queryRunner.query(`DROP TABLE "location_access_history"`);
    }
}
