import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingLandingPageEntity1735448747595 implements MigrationInterface {
    name = 'AddingLandingPageEntity1735448747595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "landing_pages" ("landingPageId" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "link" character varying(255) NOT NULL, "visible" boolean NOT NULL DEFAULT true, "storeId" integer, CONSTRAINT "PK_1dc413ec13bd77d8c3adb7bd922" PRIMARY KEY ("landingPageId"))`);
        await queryRunner.query(`ALTER TABLE "landing_pages" ADD CONSTRAINT "FK_3cc76f1a9c16dc0256d601e447e" FOREIGN KEY ("storeId") REFERENCES "stores"("storeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "landing_pages" DROP CONSTRAINT "FK_3cc76f1a9c16dc0256d601e447e"`);
        await queryRunner.query(`DROP TABLE "landing_pages"`);
    }

}
