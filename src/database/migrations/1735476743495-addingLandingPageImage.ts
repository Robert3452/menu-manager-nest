import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingLandingPageImage1735476743495 implements MigrationInterface {
    name = 'AddingLandingPageImage1735476743495'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "landing_pages" ADD "image" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "landing_pages" DROP CONSTRAINT "FK_3cc76f1a9c16dc0256d601e447e"`);
        await queryRunner.query(`ALTER TABLE "landing_pages" ALTER COLUMN "link" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "landing_pages" ALTER COLUMN "storeId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "landing_pages" ADD CONSTRAINT "FK_3cc76f1a9c16dc0256d601e447e" FOREIGN KEY ("storeId") REFERENCES "stores"("storeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "landing_pages" DROP CONSTRAINT "FK_3cc76f1a9c16dc0256d601e447e"`);
        await queryRunner.query(`ALTER TABLE "landing_pages" ALTER COLUMN "storeId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "landing_pages" ALTER COLUMN "link" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "landing_pages" ADD CONSTRAINT "FK_3cc76f1a9c16dc0256d601e447e" FOREIGN KEY ("storeId") REFERENCES "stores"("storeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "landing_pages" DROP COLUMN "image"`);
    }

}
