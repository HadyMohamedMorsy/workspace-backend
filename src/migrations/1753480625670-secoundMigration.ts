import { MigrationInterface, QueryRunner } from "typeorm";

export class SecoundMigration1753480625670 implements MigrationInterface {
    name = 'SecoundMigration1753480625670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP CONSTRAINT "FK_47998eff7ae89f864d5604e5b56"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_63ae5977e02c9a7a4fb431b5870"`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" DROP CONSTRAINT "FK_da09f4b0253eb252fe8adade306"`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" DROP CONSTRAINT "FK_36e48f64fb35c5772bc3d57707a"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP CONSTRAINT "REL_47998eff7ae89f864d5604e5b5"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP COLUMN "depositesId"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "REL_63ae5977e02c9a7a4fb431b587"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "depositesId"`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" DROP CONSTRAINT "REL_da09f4b0253eb252fe8adade30"`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" DROP COLUMN "depositesId"`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" DROP CONSTRAINT "REL_36e48f64fb35c5772bc3d57707"`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" DROP COLUMN "depositesId"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD "is_paid" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD "deposites" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "is_paid" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "deposites" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" ADD "is_paid" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" ADD "deposites" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" ADD "is_paid" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" ADD "deposites" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignes_membership" DROP COLUMN "deposites"`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" DROP COLUMN "is_paid"`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" DROP COLUMN "deposites"`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" DROP COLUMN "is_paid"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "deposites"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "is_paid"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP COLUMN "deposites"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP COLUMN "is_paid"`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" ADD "depositesId" integer`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" ADD CONSTRAINT "REL_36e48f64fb35c5772bc3d57707" UNIQUE ("depositesId")`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" ADD "depositesId" integer`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" ADD CONSTRAINT "REL_da09f4b0253eb252fe8adade30" UNIQUE ("depositesId")`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "depositesId" integer`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "REL_63ae5977e02c9a7a4fb431b587" UNIQUE ("depositesId")`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD "depositesId" integer`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD CONSTRAINT "REL_47998eff7ae89f864d5604e5b5" UNIQUE ("depositesId")`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" ADD CONSTRAINT "FK_36e48f64fb35c5772bc3d57707a" FOREIGN KEY ("depositesId") REFERENCES "deposite"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" ADD CONSTRAINT "FK_da09f4b0253eb252fe8adade306" FOREIGN KEY ("depositesId") REFERENCES "deposite"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_63ae5977e02c9a7a4fb431b5870" FOREIGN KEY ("depositesId") REFERENCES "deposite"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD CONSTRAINT "FK_47998eff7ae89f864d5604e5b56" FOREIGN KEY ("depositesId") REFERENCES "deposite"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
