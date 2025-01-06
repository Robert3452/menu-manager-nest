import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactoringLandingPageEntity1735524876997 implements MigrationInterface {
    name = 'RefactoringLandingPageEntity1735524876997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "landing_pages" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "landing_pages" ADD "title" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "landing_pages" ADD "description" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "landing_pages" ADD "buttons" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "landing_pages" DROP COLUMN "buttons"`);
        await queryRunner.query(`ALTER TABLE "landing_pages" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "landing_pages" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "landing_pages" ADD "name" character varying(255) NOT NULL`);
    }

}
