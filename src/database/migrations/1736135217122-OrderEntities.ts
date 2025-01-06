import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderEntities1736135217122 implements MigrationInterface {
    name = 'OrderEntities1736135217122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "orders" ("orderId" SERIAL NOT NULL, "customerName" character varying(100) NOT NULL, "customerEmail" character varying(100) NOT NULL, "customerPhone" character varying(15) NOT NULL, "orderDate" TIMESTAMP NOT NULL DEFAULT now(), "totalPrice" numeric NOT NULL, CONSTRAINT "PK_41ba27842ac1a2c24817ca59eaa" PRIMARY KEY ("orderId"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("orderItemId" SERIAL NOT NULL, "orderId" integer NOT NULL, "productId" integer NOT NULL, "quantity" integer NOT NULL, "price" numeric NOT NULL, CONSTRAINT "PK_4e1bb5fea3ad96dcc899be6cc7d" PRIMARY KEY ("orderItemId"))`);
        await queryRunner.query(`CREATE TABLE "order_item_toppings" ("orderItemToppingId" SERIAL NOT NULL, "orderItemId" integer NOT NULL, "toppingId" integer NOT NULL, "quantity" integer NOT NULL, "price" numeric NOT NULL, CONSTRAINT "PK_2ca289f5263bec74662836e5a42" PRIMARY KEY ("orderItemToppingId"))`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES "products"("productId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item_toppings" ADD CONSTRAINT "FK_1a74ccebef16dd8afba0527edee" FOREIGN KEY ("orderItemId") REFERENCES "order_items"("orderItemId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item_toppings" ADD CONSTRAINT "FK_a10302aa366869faacb0ad637cc" FOREIGN KEY ("toppingId") REFERENCES "toppings"("toppingId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item_toppings" DROP CONSTRAINT "FK_a10302aa366869faacb0ad637cc"`);
        await queryRunner.query(`ALTER TABLE "order_item_toppings" DROP CONSTRAINT "FK_1a74ccebef16dd8afba0527edee"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_cdb99c05982d5191ac8465ac010"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d"`);
        await queryRunner.query(`DROP TABLE "order_item_toppings"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
    }

}
