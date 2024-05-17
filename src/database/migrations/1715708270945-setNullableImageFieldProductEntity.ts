import { MigrationInterface, QueryRunner } from "typeorm";

export class SetNullableImageFieldProductEntity1715708270945 implements MigrationInterface {
    name = 'SetNullableImageFieldProductEntity1715708270945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "image" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "toppings_categories" ADD CONSTRAINT "UQ_b856649d883dbcbe9d09c0b11dd" UNIQUE ("title")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toppings_categories" DROP CONSTRAINT "UQ_b856649d883dbcbe9d09c0b11dd"`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "image" SET NOT NULL`);
    }

}
