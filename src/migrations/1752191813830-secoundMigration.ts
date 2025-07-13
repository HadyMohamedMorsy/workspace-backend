import { MigrationInterface, QueryRunner } from "typeorm";

export class SecoundMigration1752191813830 implements MigrationInterface {
    name = 'SecoundMigration1752191813830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD "reservation_start_hour" integer`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD "reservation_start_minute" integer`);
        await queryRunner.query(`CREATE TYPE "public"."reservation_room_reservation_start_time_enum" AS ENUM('am', 'pm')`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD "reservation_start_time" "public"."reservation_room_reservation_start_time_enum"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD "reservation_end_hour" integer`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD "reservation_end_minute" integer`);
        await queryRunner.query(`CREATE TYPE "public"."reservation_room_reservation_end_time_enum" AS ENUM('am', 'pm')`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD "reservation_end_time" "public"."reservation_room_reservation_end_time_enum"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ALTER COLUMN "status" SET DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation_room" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP COLUMN "reservation_end_time"`);
        await queryRunner.query(`DROP TYPE "public"."reservation_room_reservation_end_time_enum"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP COLUMN "reservation_end_minute"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP COLUMN "reservation_end_hour"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP COLUMN "reservation_start_time"`);
        await queryRunner.query(`DROP TYPE "public"."reservation_room_reservation_start_time_enum"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP COLUMN "reservation_start_minute"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP COLUMN "reservation_start_hour"`);
    }

}
