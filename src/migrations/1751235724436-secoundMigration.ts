import { MigrationInterface, QueryRunner } from "typeorm";

export class SecoundMigration1751235724436 implements MigrationInterface {
    name = 'SecoundMigration1751235724436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shared" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "shared" ADD "total_price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "deskarea" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "deskarea" ADD "total_price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD "total_price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "total_price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" ADD "total_price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "deposite" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "deposite" ADD "total_price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" ADD "total_price" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "selling_price"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "selling_price" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "selling_price"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "selling_price" integer`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" ADD "total_price" integer`);
        await queryRunner.query(`ALTER TABLE "deposite" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "deposite" ADD "total_price" integer`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" ADD "total_price" integer`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "total_price" integer`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD "total_price" integer`);
        await queryRunner.query(`ALTER TABLE "deskarea" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "deskarea" ADD "total_price" integer`);
        await queryRunner.query(`ALTER TABLE "shared" DROP COLUMN "total_price"`);
        await queryRunner.query(`ALTER TABLE "shared" ADD "total_price" integer`);
    }

}
