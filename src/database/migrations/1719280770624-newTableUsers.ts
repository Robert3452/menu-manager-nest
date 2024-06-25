import { MigrationInterface, QueryRunner } from "typeorm";

export class NewTableUsers1719280770624 implements MigrationInterface {
    name = 'NewTableUsers1719280770624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store_has_users" ("userId" integer NOT NULL, "storeId" integer NOT NULL, CONSTRAINT "PK_b0f3abd7e74c88d8b7572696550" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`ALTER TABLE "store_has_users" ADD CONSTRAINT "FK_79d823fabaa881866ebe01fba6d" FOREIGN KEY ("storeId") REFERENCES "stores"("storeId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_has_users" DROP CONSTRAINT "FK_79d823fabaa881866ebe01fba6d"`);
        await queryRunner.query(`DROP TABLE "store_has_users"`);
    }

}
