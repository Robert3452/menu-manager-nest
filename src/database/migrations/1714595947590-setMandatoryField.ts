import { MigrationInterface, QueryRunner } from "typeorm";

export class SetMandatoryField1714595947590 implements MigrationInterface {
    name = 'SetMandatoryField1714595947590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toppings_categories" RENAME COLUMN "subtitle" TO "mandatory"`);
        await queryRunner.query(`ALTER TABLE "toppings_categories" DROP COLUMN "mandatory"`);
        await queryRunner.query(`ALTER TABLE "toppings_categories" ADD "mandatory" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "toppings_categories" DROP COLUMN "mandatory"`);
        await queryRunner.query(`ALTER TABLE "toppings_categories" ADD "mandatory" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "toppings_categories" RENAME COLUMN "mandatory" TO "subtitle"`);
    }

}
