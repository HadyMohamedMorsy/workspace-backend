import { MigrationInterface, QueryRunner } from "typeorm";

export class SecoundMigration1750803191299 implements MigrationInterface {
    name = 'SecoundMigration1750803191299'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."revenue_child_payment_method_enum" AS ENUM('cach', 'instapay', 'visa', 'vodafone-cach')`);
        await queryRunner.query(`ALTER TABLE "revenue_child" ADD "payment_method" "public"."revenue_child_payment_method_enum" DEFAULT 'cach'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "revenue_child" DROP COLUMN "payment_method"`);
        await queryRunner.query(`DROP TYPE "public"."revenue_child_payment_method_enum"`);
    }

}
