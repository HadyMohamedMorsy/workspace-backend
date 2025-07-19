import { MigrationInterface, QueryRunner } from "typeorm";

export class SecoundMigration1752899439861 implements MigrationInterface {
    name = 'SecoundMigration1752899439861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "custom_settings" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "price_shared" numeric(10,2) DEFAULT '0', "price_deskarea" numeric(10,2) DEFAULT '0', "full_day_price_deskarea" numeric(10,2) DEFAULT '0', "full_day_price_shared" numeric(10,2) DEFAULT '0', "full_day_hours" numeric(10,2) DEFAULT '0', "is_active" boolean DEFAULT false, "rooms" json, "individualId" integer, "companyId" integer, "studentActivityId" integer, "createdById" integer, CONSTRAINT "PK_eafeb21e3066e05b5a50d8c105e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "custom_settings" ADD CONSTRAINT "FK_cd2255b7ded6a5ba80e272f3c94" FOREIGN KEY ("individualId") REFERENCES "individual"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "custom_settings" ADD CONSTRAINT "FK_7f910950be17507ab20b894433e" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "custom_settings" ADD CONSTRAINT "FK_aa6dda9e27933ce894e77f6066e" FOREIGN KEY ("studentActivityId") REFERENCES "student_activity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "custom_settings" ADD CONSTRAINT "FK_13b3d5aad6fb44bf7a881b3d99c" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "custom_settings" DROP CONSTRAINT "FK_13b3d5aad6fb44bf7a881b3d99c"`);
        await queryRunner.query(`ALTER TABLE "custom_settings" DROP CONSTRAINT "FK_aa6dda9e27933ce894e77f6066e"`);
        await queryRunner.query(`ALTER TABLE "custom_settings" DROP CONSTRAINT "FK_7f910950be17507ab20b894433e"`);
        await queryRunner.query(`ALTER TABLE "custom_settings" DROP CONSTRAINT "FK_cd2255b7ded6a5ba80e272f3c94"`);
        await queryRunner.query(`DROP TABLE "custom_settings"`);
    }

}
