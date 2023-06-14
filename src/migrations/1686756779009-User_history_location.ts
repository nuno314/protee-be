import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserHistoryLocation1686756779009 implements MigrationInterface {
    name = 'UserHistoryLocation1686756779009';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user_location_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_by" uuid, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_by" uuid, "deleted_at" TIMESTAMP WITH TIME ZONE, "current_lat" numeric(10,6) NOT NULL, "current_long" numeric(10,6) NOT NULL, CONSTRAINT "PK_f81737c6bb76857ee4e51543163" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(`ALTER TABLE "location_access_history" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "location_access_history" DROP COLUMN "current_lat"`);
        await queryRunner.query(`ALTER TABLE "location_access_history" DROP COLUMN "current_long"`);
        await queryRunner.query(`ALTER TABLE "location_access_history" ADD "user_location_history_id" uuid`);
        await queryRunner.query(
            `ALTER TABLE "location_access_history" ADD CONSTRAINT "FK_f86af26e6325439e21956c38dac" FOREIGN KEY ("user_location_history_id") REFERENCES "user_location_history"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location_access_history" DROP CONSTRAINT "FK_f86af26e6325439e21956c38dac"`);
        await queryRunner.query(`ALTER TABLE "location_access_history" DROP COLUMN "user_location_history_id"`);
        await queryRunner.query(`ALTER TABLE "location_access_history" ADD "current_long" numeric(10,6) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location_access_history" ADD "current_lat" numeric(10,6) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "location_access_history" ADD "user_id" uuid`);
        await queryRunner.query(`DROP TABLE "user_location_history"`);
    }
}
