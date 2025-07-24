import { MigrationInterface, QueryRunner } from "typeorm";

export class SecoundMigration1753138871809 implements MigrationInterface {
    name = 'SecoundMigration1753138871809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."deposite_status_enum" RENAME TO "deposite_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."deposite_status_enum" AS ENUM('cancelled', 'active', 'complete')`);
        await queryRunner.query(`ALTER TABLE "deposite" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "deposite" ALTER COLUMN "status" TYPE "public"."deposite_status_enum" USING "status"::"text"::"public"."deposite_status_enum"`);
        await queryRunner.query(`ALTER TABLE "deposite" ALTER COLUMN "status" SET DEFAULT 'active'`);
        await queryRunner.query(`DROP TYPE "public"."deposite_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."deposite_status_enum_old" AS ENUM('cancelled', 'complete')`);
        await queryRunner.query(`ALTER TABLE "deposite" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "deposite" ALTER COLUMN "status" TYPE "public"."deposite_status_enum_old" USING "status"::"text"::"public"."deposite_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "deposite" ALTER COLUMN "status" SET DEFAULT 'complete'`);
        await queryRunner.query(`DROP TYPE "public"."deposite_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."deposite_status_enum_old" RENAME TO "deposite_status_enum"`);
    }

}
