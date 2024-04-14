import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1713122925643 implements MigrationInterface {
  name = 'InitMigration1713122925643';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "weekdays" ("weekdayId" SERIAL NOT NULL, "name" character varying(20) NOT NULL, CONSTRAINT "UQ_cfe3746e1af8d13ef12bb522b0f" UNIQUE ("name"), CONSTRAINT "PK_30625ead04450e4fcbdf00af2f5" PRIMARY KEY ("weekdayId"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."addresses_streettype_enum" AS ENUM('avenue', 'street', 'jiron', 'pasaje')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."addresses_addresstype_enum" AS ENUM('house', 'work')`,
    );
    await queryRunner.query(
      `CREATE TABLE "addresses" ("addressId" SERIAL NOT NULL, "address" character varying(50) NOT NULL, "department" character varying(20) NOT NULL, "province" character varying(20) NOT NULL, "district" character varying(50) NOT NULL, "mapLink" character varying(500), "streetNumber" character varying(10) NOT NULL, "streetType" "public"."addresses_streettype_enum" NOT NULL, "addressType" "public"."addresses_addresstype_enum" NOT NULL, "phoneNumber" character varying(20) NOT NULL, "references" character varying(200) NOT NULL, "branchId" integer NOT NULL, CONSTRAINT "REL_263d1febf392bcb8047aa436a0" UNIQUE ("branchId"), CONSTRAINT "PK_ff59275f5928941ce06f1d8890c" PRIMARY KEY ("addressId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "toppings" ("toppingId" SERIAL NOT NULL, "available" boolean NOT NULL DEFAULT true, "title" character varying(300) NOT NULL, "price" numeric NOT NULL, "maxLimit" integer NOT NULL, "index" integer NOT NULL, "required" boolean NOT NULL DEFAULT true, "toppingCategoryId" integer NOT NULL, CONSTRAINT "PK_89760e97173ff785d451a545a7a" PRIMARY KEY ("toppingId"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."toppings_categories_toppingtype_enum" AS ENUM('exclusive', 'inclusive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "toppings_categories" ("toppingsCategoryId" SERIAL NOT NULL, "title" character varying(50) NOT NULL, "subtitle" character varying(50), "minToppingsForCategory" integer NOT NULL, "maxToppingsForCategory" integer NOT NULL, "toppingType" "public"."toppings_categories_toppingtype_enum" NOT NULL, "index" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "UQ_b856649d883dbcbe9d09c0b11dd" UNIQUE ("title"), CONSTRAINT "PK_88130d4d97d3fc0f7f20308271f" PRIMARY KEY ("toppingsCategoryId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("productId" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "content" character varying(500) NOT NULL, "image" character varying(300) NOT NULL, "index" integer NOT NULL, "realPrice" numeric NOT NULL, "corridorId" integer NOT NULL, CONSTRAINT "PK_7b3b507508cd0f86a5b2e923459" PRIMARY KEY ("productId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "corridors" ("corridorId" SERIAL NOT NULL, "name" character varying(300) NOT NULL, "description" character varying(400) NOT NULL, "index" integer NOT NULL, CONSTRAINT "PK_1f4cd7ea5f323ed4969530dd39c" PRIMARY KEY ("corridorId"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."weekday_schedules_weekday_enum" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')`,
    );
    await queryRunner.query(
      `CREATE TABLE "weekday_schedules" ("weekdayScheduleId" SERIAL NOT NULL, "index" integer NOT NULL, "weekday" "public"."weekday_schedules_weekday_enum" NOT NULL, "openTime" TIMESTAMP, "endTime" TIMESTAMP, "closed" boolean NOT NULL DEFAULT false, "scheduleId" integer NOT NULL, CONSTRAINT "PK_75cad493fb9edd0cd0fd383e4db" PRIMARY KEY ("weekdayScheduleId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "schedules" ("scheduleId" SERIAL NOT NULL, "branchId" integer NOT NULL, CONSTRAINT "REL_92233c841da29d74c4ed39e1d9" UNIQUE ("branchId"), CONSTRAINT "PK_be0de31e8aee28fcfa49498969e" PRIMARY KEY ("scheduleId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "branches" ("branchId" SERIAL NOT NULL, "branchName" character varying(200) NOT NULL, "storeId" integer NOT NULL, CONSTRAINT "PK_3166ff642c447e50ec06c553e21" PRIMARY KEY ("branchId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stores" ("storeId" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "logo" character varying(400) NOT NULL, CONSTRAINT "UQ_a205ca5a37fa5e10005f003aaf3" UNIQUE ("name"), CONSTRAINT "PK_aae7a9efec0e6e614522d90c840" PRIMARY KEY ("storeId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tags" ("tagId" SERIAL NOT NULL, "name" character varying(200) NOT NULL, CONSTRAINT "PK_12a0c5dcf89ed48c6c7b385a4be" PRIMARY KEY ("tagId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "branchesHasCorridors" ("branchId" integer NOT NULL, "corridorId" integer NOT NULL, CONSTRAINT "PK_d54ad1f8ef7b69d6a1cd793eb16" PRIMARY KEY ("branchId", "corridorId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2d9cc533f22b2edffbaafb0276" ON "branchesHasCorridors" ("branchId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_68abaef1c8f64041f359926253" ON "branchesHasCorridors" ("corridorId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "storesHasTags" ("tagId" integer NOT NULL, "storeId" integer NOT NULL, CONSTRAINT "PK_bebaefa3293e51264e429a95105" PRIMARY KEY ("tagId", "storeId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e50241f7e28c4ad39efa89af3a" ON "storesHasTags" ("tagId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6019ff4fe7fab67f7c5a443d64" ON "storesHasTags" ("storeId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_263d1febf392bcb8047aa436a05" FOREIGN KEY ("branchId") REFERENCES "branches"("branchId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "toppings" ADD CONSTRAINT "FK_ffdbc472a9adbcaaee66e6fbee1" FOREIGN KEY ("toppingCategoryId") REFERENCES "toppings_categories"("toppingsCategoryId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "toppings_categories" ADD CONSTRAINT "FK_157186cb9a3e6fe7c219a31b9cd" FOREIGN KEY ("productId") REFERENCES "products"("productId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_ac28e00701074bf16113c0d2e9c" FOREIGN KEY ("corridorId") REFERENCES "corridors"("corridorId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "weekday_schedules" ADD CONSTRAINT "FK_768fb0756ee9e13f5380eb8508e" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("scheduleId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedules" ADD CONSTRAINT "FK_92233c841da29d74c4ed39e1d90" FOREIGN KEY ("branchId") REFERENCES "branches"("branchId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "branches" ADD CONSTRAINT "FK_78d545440c190869e8278b99b35" FOREIGN KEY ("storeId") REFERENCES "stores"("storeId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "branchesHasCorridors" ADD CONSTRAINT "FK_2d9cc533f22b2edffbaafb0276a" FOREIGN KEY ("branchId") REFERENCES "corridors"("corridorId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "branchesHasCorridors" ADD CONSTRAINT "FK_68abaef1c8f64041f359926253b" FOREIGN KEY ("corridorId") REFERENCES "branches"("branchId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "storesHasTags" ADD CONSTRAINT "FK_e50241f7e28c4ad39efa89af3aa" FOREIGN KEY ("tagId") REFERENCES "stores"("storeId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "storesHasTags" ADD CONSTRAINT "FK_6019ff4fe7fab67f7c5a443d64a" FOREIGN KEY ("storeId") REFERENCES "tags"("tagId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "storesHasTags" DROP CONSTRAINT "FK_6019ff4fe7fab67f7c5a443d64a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "storesHasTags" DROP CONSTRAINT "FK_e50241f7e28c4ad39efa89af3aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "branchesHasCorridors" DROP CONSTRAINT "FK_68abaef1c8f64041f359926253b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "branchesHasCorridors" DROP CONSTRAINT "FK_2d9cc533f22b2edffbaafb0276a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "branches" DROP CONSTRAINT "FK_78d545440c190869e8278b99b35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "schedules" DROP CONSTRAINT "FK_92233c841da29d74c4ed39e1d90"`,
    );
    await queryRunner.query(
      `ALTER TABLE "weekday_schedules" DROP CONSTRAINT "FK_768fb0756ee9e13f5380eb8508e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_ac28e00701074bf16113c0d2e9c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "toppings_categories" DROP CONSTRAINT "FK_157186cb9a3e6fe7c219a31b9cd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "toppings" DROP CONSTRAINT "FK_ffdbc472a9adbcaaee66e6fbee1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "FK_263d1febf392bcb8047aa436a05"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6019ff4fe7fab67f7c5a443d64"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e50241f7e28c4ad39efa89af3a"`,
    );
    await queryRunner.query(`DROP TABLE "storesHasTags"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_68abaef1c8f64041f359926253"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2d9cc533f22b2edffbaafb0276"`,
    );
    await queryRunner.query(`DROP TABLE "branchesHasCorridors"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "stores"`);
    await queryRunner.query(`DROP TABLE "branches"`);
    await queryRunner.query(`DROP TABLE "schedules"`);
    await queryRunner.query(`DROP TABLE "weekday_schedules"`);
    await queryRunner.query(
      `DROP TYPE "public"."weekday_schedules_weekday_enum"`,
    );
    await queryRunner.query(`DROP TABLE "corridors"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "toppings_categories"`);
    await queryRunner.query(
      `DROP TYPE "public"."toppings_categories_toppingtype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "toppings"`);
    await queryRunner.query(`DROP TABLE "addresses"`);
    await queryRunner.query(`DROP TYPE "public"."addresses_addresstype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."addresses_streettype_enum"`);
    await queryRunner.query(`DROP TABLE "weekdays"`);
  }
}
