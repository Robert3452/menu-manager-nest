import { MigrationInterface, QueryRunner } from "typeorm";

export class SetCascadeDeleteInBranchAndCorridors1722345916640 implements MigrationInterface {
    name = 'SetCascadeDeleteInBranchAndCorridors1722345916640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branchesHasCorridors" DROP CONSTRAINT "FK_2d9cc533f22b2edffbaafb0276a"`);
        await queryRunner.query(`ALTER TABLE "branchesHasCorridors" ADD CONSTRAINT "FK_2d9cc533f22b2edffbaafb0276a" FOREIGN KEY ("branchId") REFERENCES "branches"("branchId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "branchesHasCorridors" DROP CONSTRAINT "FK_2d9cc533f22b2edffbaafb0276a"`);
        await queryRunner.query(`ALTER TABLE "branchesHasCorridors" ADD CONSTRAINT "FK_2d9cc533f22b2edffbaafb0276a" FOREIGN KEY ("branchId") REFERENCES "branches"("branchId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
