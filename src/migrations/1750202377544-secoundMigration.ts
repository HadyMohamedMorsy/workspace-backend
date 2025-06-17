import { MigrationInterface, QueryRunner } from "typeorm";

export class SecoundMigration1750202377544 implements MigrationInterface {
    name = 'SecoundMigration1750202377544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "general_settings" ADD "full_day_hours" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "returns" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "offer_packages" DROP COLUMN "hours"`);
        await queryRunner.query(`ALTER TABLE "offer_packages" ADD "hours" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "offer_packages" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "offer_packages" ADD "price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "room" ADD "price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "general_settings" ALTER COLUMN "price_shared" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "general_settings" ALTER COLUMN "price_deskarea" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "general_settings" ALTER COLUMN "full_day_price_deskarea" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "general_settings" ALTER COLUMN "full_day_price_shared" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "co_working_space" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "co_working_space" ADD "price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "order_price"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "order_price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total_order"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "total_order" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "purshase_price"`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "purshase_price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "weight_g"`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "weight_g" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "weight_product"`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "weight_product" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "purchase" ALTER COLUMN "purshase_qty" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchase" ALTER COLUMN "total" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "purshase_price"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "purshase_price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "returns" DROP COLUMN "return_price"`);
        await queryRunner.query(`ALTER TABLE "returns" ADD "return_price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "returns" DROP COLUMN "weight_g"`);
        await queryRunner.query(`ALTER TABLE "returns" ADD "weight_g" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "returns" DROP COLUMN "weight_product"`);
        await queryRunner.query(`ALTER TABLE "returns" ADD "weight_product" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "returns" ALTER COLUMN "return_qty" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "returns" ALTER COLUMN "total" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "returns" ALTER COLUMN "total" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "returns" ALTER COLUMN "return_qty" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "returns" DROP COLUMN "weight_product"`);
        await queryRunner.query(`ALTER TABLE "returns" ADD "weight_product" integer`);
        await queryRunner.query(`ALTER TABLE "returns" DROP COLUMN "weight_g"`);
        await queryRunner.query(`ALTER TABLE "returns" ADD "weight_g" integer`);
        await queryRunner.query(`ALTER TABLE "returns" DROP COLUMN "return_price"`);
        await queryRunner.query(`ALTER TABLE "returns" ADD "return_price" integer`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "purshase_price"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "purshase_price" integer`);
        await queryRunner.query(`ALTER TABLE "purchase" ALTER COLUMN "total" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchase" ALTER COLUMN "purshase_qty" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "weight_product"`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "weight_product" integer`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "weight_g"`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "weight_g" integer`);
        await queryRunner.query(`ALTER TABLE "purchase" DROP COLUMN "purshase_price"`);
        await queryRunner.query(`ALTER TABLE "purchase" ADD "purshase_price" integer`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total_order"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "total_order" integer`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "order_price"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "order_price" integer`);
        await queryRunner.query(`ALTER TABLE "co_working_space" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "co_working_space" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "general_settings" ALTER COLUMN "full_day_price_shared" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "general_settings" ALTER COLUMN "full_day_price_deskarea" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "general_settings" ALTER COLUMN "price_deskarea" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "general_settings" ALTER COLUMN "price_shared" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "room" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer_packages" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "offer_packages" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "offer_packages" DROP COLUMN "hours"`);
        await queryRunner.query(`ALTER TABLE "offer_packages" ADD "hours" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "returns" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "general_settings" DROP COLUMN "full_day_hours"`);
    }

}
