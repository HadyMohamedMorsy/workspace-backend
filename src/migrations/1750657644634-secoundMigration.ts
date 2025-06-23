import { MigrationInterface, QueryRunner } from "typeorm";

export class SecoundMigration1750657644634 implements MigrationInterface {
    name = 'SecoundMigration1750657644634'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "general_settings" ADD "alert_store" integer`);
        await queryRunner.query(`CREATE TYPE "public"."expense_place_child_payment_method_enum" AS ENUM('cach', 'instapay', 'visa', 'vodafone-cach')`);
        await queryRunner.query(`ALTER TABLE "expense_place_child" ADD "payment_method" "public"."expense_place_child_payment_method_enum" DEFAULT 'cach'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense_place_child" DROP COLUMN "payment_method"`);
        await queryRunner.query(`DROP TYPE "public"."expense_place_child_payment_method_enum"`);
        await queryRunner.query(`ALTER TABLE "general_settings" DROP COLUMN "alert_store"`);
    }

}
