import { MigrationInterface, QueryRunner } from "typeorm";

export class AllowDuplicatedtitlesToppingCategories1714954322753 implements MigrationInterface {
    name = 'AllowDuplicatedtitlesToppingCategories1714954322753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toppings_categories" DROP CONSTRAINT "UQ_b856649d883dbcbe9d09c0b11dd"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toppings_categories" ADD CONSTRAINT "UQ_b856649d883dbcbe9d09c0b11dd" UNIQUE ("title")`);
    }

}
