import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1735893005289 implements MigrationInterface {
    name = 'FirstMigration1735893005289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying(96) NOT NULL, "lastName" character varying(96), "username" character varying(96), "email" character varying(96), "password" character varying(96), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "student_activity" ("id" SERIAL NOT NULL, "name" character varying(256) NOT NULL, "unviresty" character varying(256) NOT NULL, "college" character varying(256) NOT NULL, "subjects" text, "holders" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dfda224476718bb7e099889b930" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "individual" ("id" SERIAL NOT NULL, "name" character varying(256) NOT NULL, "number" character varying(11) NOT NULL, "whatsApp" character varying NOT NULL, "individual_type" character varying NOT NULL DEFAULT 'freelancer', "employed_job" character varying, "freelancer_job" character varying, "unviresty" character varying, "college" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6236cfa94a940a14729b69d4e64" UNIQUE ("number"), CONSTRAINT "UQ_589d633a38525c92dd87f1ee93b" UNIQUE ("whatsApp"), CONSTRAINT "PK_65e322b841a6d5e28a488d584de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."company_company_type_enum" AS ENUM('General', 'NGOs')`);
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying(256) NOT NULL, "phone" character varying(11) NOT NULL, "city" character varying(256) NOT NULL, "company_type" "public"."company_company_type_enum" NOT NULL DEFAULT 'General', "address" text, "whatsApp" character varying NOT NULL, "facebook" character varying, "website" character varying, "instagram" character varying, "linkedin" character varying, "holders" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e53ef0697f9d5d933fa075be1c3" UNIQUE ("phone"), CONSTRAINT "UQ_dbb467625f453730336a9136d6c" UNIQUE ("whatsApp"), CONSTRAINT "UQ_6d09f7c3e4ddf573f842bfa51c7" UNIQUE ("facebook"), CONSTRAINT "UQ_96c8a2ca6771f4e66d01e5270eb" UNIQUE ("website"), CONSTRAINT "UQ_7dc7f95dd5c92a645c93a9417ba" UNIQUE ("instagram"), CONSTRAINT "UQ_5b43f77b200fd08d92dbf00c5f3" UNIQUE ("linkedin"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TYPE "public"."company_company_type_enum"`);
        await queryRunner.query(`DROP TABLE "individual"`);
        await queryRunner.query(`DROP TABLE "student_activity"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
