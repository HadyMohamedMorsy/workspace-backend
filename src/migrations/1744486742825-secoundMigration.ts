import { MigrationInterface, QueryRunner } from "typeorm";

export class SecoundMigration1744486742825 implements MigrationInterface {
    name = 'SecoundMigration1744486742825'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."deposite_status_enum" AS ENUM('cancelled', 'complete')`);
        await queryRunner.query(`CREATE TYPE "public"."deposite_payment_method_enum" AS ENUM('cach', 'instapay', 'visa', 'vodafone-cach')`);
        await queryRunner.query(`CREATE TABLE "deposite" ("id" SERIAL NOT NULL, "total_price" integer, "status" "public"."deposite_status_enum" NOT NULL DEFAULT 'complete', "payment_method" "public"."deposite_payment_method_enum" DEFAULT 'cach', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "createdById" integer, CONSTRAINT "PK_1608c2cdbb88579c6d136676703" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."shared_payment_method_enum" AS ENUM('cach', 'instapay', 'visa', 'vodafone-cach')`);
        await queryRunner.query(`ALTER TABLE "shared" ADD "payment_method" "public"."shared_payment_method_enum" DEFAULT 'cach'`);
        await queryRunner.query(`CREATE TYPE "public"."deskarea_payment_method_enum" AS ENUM('cach', 'instapay', 'visa', 'vodafone-cach')`);
        await queryRunner.query(`ALTER TABLE "deskarea" ADD "payment_method" "public"."deskarea_payment_method_enum" DEFAULT 'cach'`);
        await queryRunner.query(`CREATE TYPE "public"."reservation_room_payment_method_enum" AS ENUM('cach', 'instapay', 'visa', 'vodafone-cach')`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD "payment_method" "public"."reservation_room_payment_method_enum" DEFAULT 'cach'`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD "depositesId" integer`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD CONSTRAINT "UQ_47998eff7ae89f864d5604e5b56" UNIQUE ("depositesId")`);
        await queryRunner.query(`CREATE TYPE "public"."order_payment_method_enum" AS ENUM('cach', 'instapay', 'visa', 'vodafone-cach')`);
        await queryRunner.query(`ALTER TABLE "order" ADD "payment_method" "public"."order_payment_method_enum" DEFAULT 'cach'`);
        await queryRunner.query(`ALTER TABLE "individual" ADD "nationality" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."deals_payment_method_enum" AS ENUM('cach', 'instapay', 'visa', 'vodafone-cach')`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "payment_method" "public"."deals_payment_method_enum" DEFAULT 'cach'`);
        await queryRunner.query(`ALTER TABLE "deals" ADD "depositesId" integer`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "UQ_63ae5977e02c9a7a4fb431b5870" UNIQUE ("depositesId")`);
        await queryRunner.query(`CREATE TYPE "public"."assignes_packages_payment_method_enum" AS ENUM('cach', 'instapay', 'visa', 'vodafone-cach')`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" ADD "payment_method" "public"."assignes_packages_payment_method_enum" DEFAULT 'cach'`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" ADD "depositesId" integer`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" ADD CONSTRAINT "UQ_da09f4b0253eb252fe8adade306" UNIQUE ("depositesId")`);
        await queryRunner.query(`ALTER TABLE "company" ADD "nationality" character varying`);
        await queryRunner.query(`ALTER TABLE "company" ADD "email" character varying`);
        await queryRunner.query(`ALTER TABLE "company" ADD "note" character varying`);
        await queryRunner.query(`ALTER TABLE "company" ADD "featured_image" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."assignes_membership_payment_method_enum" AS ENUM('cach', 'instapay', 'visa', 'vodafone-cach')`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" ADD "payment_method" "public"."assignes_membership_payment_method_enum" DEFAULT 'cach'`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" ADD "depositesId" integer`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" ADD CONSTRAINT "UQ_36e48f64fb35c5772bc3d57707a" UNIQUE ("depositesId")`);
        await queryRunner.query(`ALTER TABLE "revenue" ADD "type" character varying NOT NULL DEFAULT 'static'`);
        await queryRunner.query(`ALTER TABLE "expense_place_child" ADD "featured_image" character varying`);
        await queryRunner.query(`ALTER TABLE "expense_place" ADD "type" character varying NOT NULL DEFAULT 'static'`);
        await queryRunner.query(`ALTER TABLE "reservation_room" ADD CONSTRAINT "FK_47998eff7ae89f864d5604e5b56" FOREIGN KEY ("depositesId") REFERENCES "deposite"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deals" ADD CONSTRAINT "FK_63ae5977e02c9a7a4fb431b5870" FOREIGN KEY ("depositesId") REFERENCES "deposite"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deposite" ADD CONSTRAINT "FK_212725f7d26b899405caa78b5af" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" ADD CONSTRAINT "FK_da09f4b0253eb252fe8adade306" FOREIGN KEY ("depositesId") REFERENCES "deposite"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" ADD CONSTRAINT "FK_36e48f64fb35c5772bc3d57707a" FOREIGN KEY ("depositesId") REFERENCES "deposite"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignes_membership" DROP CONSTRAINT "FK_36e48f64fb35c5772bc3d57707a"`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" DROP CONSTRAINT "FK_da09f4b0253eb252fe8adade306"`);
        await queryRunner.query(`ALTER TABLE "deposite" DROP CONSTRAINT "FK_212725f7d26b899405caa78b5af"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "FK_63ae5977e02c9a7a4fb431b5870"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP CONSTRAINT "FK_47998eff7ae89f864d5604e5b56"`);
        await queryRunner.query(`ALTER TABLE "expense_place" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "expense_place_child" DROP COLUMN "featured_image"`);
        await queryRunner.query(`ALTER TABLE "revenue" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" DROP CONSTRAINT "UQ_36e48f64fb35c5772bc3d57707a"`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" DROP COLUMN "depositesId"`);
        await queryRunner.query(`ALTER TABLE "assignes_membership" DROP COLUMN "payment_method"`);
        await queryRunner.query(`DROP TYPE "public"."assignes_membership_payment_method_enum"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "featured_image"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "note"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "nationality"`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" DROP CONSTRAINT "UQ_da09f4b0253eb252fe8adade306"`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" DROP COLUMN "depositesId"`);
        await queryRunner.query(`ALTER TABLE "assignes_packages" DROP COLUMN "payment_method"`);
        await queryRunner.query(`DROP TYPE "public"."assignes_packages_payment_method_enum"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP CONSTRAINT "UQ_63ae5977e02c9a7a4fb431b5870"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "depositesId"`);
        await queryRunner.query(`ALTER TABLE "deals" DROP COLUMN "payment_method"`);
        await queryRunner.query(`DROP TYPE "public"."deals_payment_method_enum"`);
        await queryRunner.query(`ALTER TABLE "individual" DROP COLUMN "nationality"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "payment_method"`);
        await queryRunner.query(`DROP TYPE "public"."order_payment_method_enum"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP CONSTRAINT "UQ_47998eff7ae89f864d5604e5b56"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP COLUMN "depositesId"`);
        await queryRunner.query(`ALTER TABLE "reservation_room" DROP COLUMN "payment_method"`);
        await queryRunner.query(`DROP TYPE "public"."reservation_room_payment_method_enum"`);
        await queryRunner.query(`ALTER TABLE "deskarea" DROP COLUMN "payment_method"`);
        await queryRunner.query(`DROP TYPE "public"."deskarea_payment_method_enum"`);
        await queryRunner.query(`ALTER TABLE "shared" DROP COLUMN "payment_method"`);
        await queryRunner.query(`DROP TYPE "public"."shared_payment_method_enum"`);
        await queryRunner.query(`DROP TABLE "deposite"`);
        await queryRunner.query(`DROP TYPE "public"."deposite_payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."deposite_status_enum"`);
    }

}
