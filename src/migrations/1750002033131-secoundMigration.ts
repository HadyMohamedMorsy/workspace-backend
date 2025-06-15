import { MigrationInterface, QueryRunner } from "typeorm";

export class SecoundMigration1750002033131 implements MigrationInterface {
    name = 'SecoundMigration1750002033131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_45c0d39d1f9ceeb56942db93cc5"`);
        await queryRunner.query(`ALTER TABLE "revenue_child" ADD "note" character varying`);
        await queryRunner.query(`ALTER TABLE "expense_place_child" ADD "note" character varying`);
        await queryRunner.query(`ALTER TABLE "returns" DROP COLUMN "return_qty"`);
        await queryRunner.query(`ALTER TABLE "returns" ADD "return_qty" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "returns" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "returns" ADD "total" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_45c0d39d1f9ceeb56942db93cc5" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_45c0d39d1f9ceeb56942db93cc5"`);
        await queryRunner.query(`ALTER TABLE "returns" DROP COLUMN "total"`);
        await queryRunner.query(`ALTER TABLE "returns" ADD "total" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "returns" DROP COLUMN "return_qty"`);
        await queryRunner.query(`ALTER TABLE "returns" ADD "return_qty" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense_place_child" DROP COLUMN "note"`);
        await queryRunner.query(`ALTER TABLE "revenue_child" DROP COLUMN "note"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_45c0d39d1f9ceeb56942db93cc5" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
