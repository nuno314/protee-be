import { MigrationInterface, QueryRunner } from 'typeorm';

export class LocationAddIcon1685882118461 implements MigrationInterface {
    name = 'LocationAddIcon1685882118461';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "location" ADD "icon" character varying NOT NULL DEFAULT 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "icon"`);
    }
}
