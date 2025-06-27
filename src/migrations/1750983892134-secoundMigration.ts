import { MigrationInterface, QueryRunner } from "typeorm";

export class SecoundMigration1750983892134 implements MigrationInterface {
    name = 'SecoundMigration1750983892134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."lookups_module_enum" AS ENUM('revenue', 'expenses', 'city', 'nationality', 'college', 'unviresty', 'company')`);
        await queryRunner.query(`CREATE TABLE "lookups" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "is_parent" boolean NOT NULL DEFAULT false, "module" "public"."lookups_module_enum", "parent_id" integer, "createdById" integer, CONSTRAINT "UQ_0134dfb784cbbfa5ba290757c40" UNIQUE ("name"), CONSTRAINT "PK_110e4351a09dc331837f1731114" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "student_activity" DROP COLUMN "unviresty"`);
        await queryRunner.query(`ALTER TABLE "student_activity" DROP COLUMN "college"`);
        await queryRunner.query(`ALTER TABLE "individual" DROP COLUMN "unviresty"`);
        await queryRunner.query(`ALTER TABLE "individual" DROP COLUMN "college"`);
        await queryRunner.query(`ALTER TABLE "individual" DROP COLUMN "nationality"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "company_type"`);
        await queryRunner.query(`DROP TYPE "public"."company_company_type_enum"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "nationality"`);
        await queryRunner.query(`ALTER TABLE "revenue" DROP CONSTRAINT "UQ_bcce27e9c880edcfddbb8b3fcd3"`);
        await queryRunner.query(`ALTER TABLE "revenue" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "revenue" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "expense_place" DROP CONSTRAINT "UQ_69628197642110f122ab6980f2c"`);
        await queryRunner.query(`ALTER TABLE "expense_place" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "expense_place" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "student_activity" ADD "unvirestyId" integer`);
        await queryRunner.query(`ALTER TABLE "student_activity" ADD "collegeId" integer`);
        await queryRunner.query(`ALTER TABLE "individual" ADD "unvirestyId" integer`);
        await queryRunner.query(`ALTER TABLE "individual" ADD "collegeId" integer`);
        await queryRunner.query(`ALTER TABLE "individual" ADD "nationalityId" integer`);
        await queryRunner.query(`ALTER TABLE "company" ADD "cityId" integer`);
        await queryRunner.query(`ALTER TABLE "company" ADD "companyTypeId" integer`);
        await queryRunner.query(`ALTER TABLE "company" ADD "nationalityId" integer`);
        await queryRunner.query(`ALTER TABLE "revenue_child" ADD "revenueChildId" integer`);
        await queryRunner.query(`ALTER TABLE "revenue" ADD "revenueId" integer`);
        await queryRunner.query(`ALTER TABLE "expense_place_child" ADD "expensePlaceChildId" integer`);
        await queryRunner.query(`ALTER TABLE "expense_place" ADD "expensePlaceId" integer`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_db34fe035593fe219081780aee" ON "revenue" ("revenueId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_70258e8c69504fb5ea2826e3af" ON "expense_place" ("expensePlaceId") `);
        await queryRunner.query(`ALTER TABLE "lookups" ADD CONSTRAINT "FK_e5b991af2a75bb6931799920f89" FOREIGN KEY ("parent_id") REFERENCES "lookups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lookups" ADD CONSTRAINT "FK_2dce0f694f531aa125f4fa8da12" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_activity" ADD CONSTRAINT "FK_fc2e2f18432e9cc5a80be4f6e29" FOREIGN KEY ("unvirestyId") REFERENCES "lookups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "student_activity" ADD CONSTRAINT "FK_781760fd54ceb3d4ba67563ca59" FOREIGN KEY ("collegeId") REFERENCES "lookups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "individual" ADD CONSTRAINT "FK_4ca9087f6a0680c0c46c503fa30" FOREIGN KEY ("unvirestyId") REFERENCES "lookups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "individual" ADD CONSTRAINT "FK_b11c7c358571495c909c9a17832" FOREIGN KEY ("collegeId") REFERENCES "lookups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "individual" ADD CONSTRAINT "FK_29d87416d6162bad7cb9a4eb39e" FOREIGN KEY ("nationalityId") REFERENCES "lookups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_d37b1b0cc9656c160b5464ac4f3" FOREIGN KEY ("cityId") REFERENCES "lookups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_37552f955f40c7423baa07355e9" FOREIGN KEY ("companyTypeId") REFERENCES "lookups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_dfb8ee9b0058c9798286e9f7ac1" FOREIGN KEY ("nationalityId") REFERENCES "lookups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "revenue_child" ADD CONSTRAINT "FK_f53b5c56c0ee6d093bfd56aa796" FOREIGN KEY ("revenueChildId") REFERENCES "lookups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "revenue" ADD CONSTRAINT "FK_db34fe035593fe219081780aee1" FOREIGN KEY ("revenueId") REFERENCES "lookups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_place_child" ADD CONSTRAINT "FK_d1678e1be22b48dd8b09310e3b7" FOREIGN KEY ("expensePlaceChildId") REFERENCES "lookups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense_place" ADD CONSTRAINT "FK_70258e8c69504fb5ea2826e3af0" FOREIGN KEY ("expensePlaceId") REFERENCES "lookups"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expense_place" DROP CONSTRAINT "FK_70258e8c69504fb5ea2826e3af0"`);
        await queryRunner.query(`ALTER TABLE "expense_place_child" DROP CONSTRAINT "FK_d1678e1be22b48dd8b09310e3b7"`);
        await queryRunner.query(`ALTER TABLE "revenue" DROP CONSTRAINT "FK_db34fe035593fe219081780aee1"`);
        await queryRunner.query(`ALTER TABLE "revenue_child" DROP CONSTRAINT "FK_f53b5c56c0ee6d093bfd56aa796"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_dfb8ee9b0058c9798286e9f7ac1"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_37552f955f40c7423baa07355e9"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_d37b1b0cc9656c160b5464ac4f3"`);
        await queryRunner.query(`ALTER TABLE "individual" DROP CONSTRAINT "FK_29d87416d6162bad7cb9a4eb39e"`);
        await queryRunner.query(`ALTER TABLE "individual" DROP CONSTRAINT "FK_b11c7c358571495c909c9a17832"`);
        await queryRunner.query(`ALTER TABLE "individual" DROP CONSTRAINT "FK_4ca9087f6a0680c0c46c503fa30"`);
        await queryRunner.query(`ALTER TABLE "student_activity" DROP CONSTRAINT "FK_781760fd54ceb3d4ba67563ca59"`);
        await queryRunner.query(`ALTER TABLE "student_activity" DROP CONSTRAINT "FK_fc2e2f18432e9cc5a80be4f6e29"`);
        await queryRunner.query(`ALTER TABLE "lookups" DROP CONSTRAINT "FK_2dce0f694f531aa125f4fa8da12"`);
        await queryRunner.query(`ALTER TABLE "lookups" DROP CONSTRAINT "FK_e5b991af2a75bb6931799920f89"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_70258e8c69504fb5ea2826e3af"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_db34fe035593fe219081780aee"`);
        await queryRunner.query(`ALTER TABLE "expense_place" DROP COLUMN "expensePlaceId"`);
        await queryRunner.query(`ALTER TABLE "expense_place_child" DROP COLUMN "expensePlaceChildId"`);
        await queryRunner.query(`ALTER TABLE "revenue" DROP COLUMN "revenueId"`);
        await queryRunner.query(`ALTER TABLE "revenue_child" DROP COLUMN "revenueChildId"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "nationalityId"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "companyTypeId"`);
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "cityId"`);
        await queryRunner.query(`ALTER TABLE "individual" DROP COLUMN "nationalityId"`);
        await queryRunner.query(`ALTER TABLE "individual" DROP COLUMN "collegeId"`);
        await queryRunner.query(`ALTER TABLE "individual" DROP COLUMN "unvirestyId"`);
        await queryRunner.query(`ALTER TABLE "student_activity" DROP COLUMN "collegeId"`);
        await queryRunner.query(`ALTER TABLE "student_activity" DROP COLUMN "unvirestyId"`);
        await queryRunner.query(`ALTER TABLE "expense_place" ADD "type" character varying NOT NULL DEFAULT 'static'`);
        await queryRunner.query(`ALTER TABLE "expense_place" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "expense_place" ADD CONSTRAINT "UQ_69628197642110f122ab6980f2c" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "revenue" ADD "type" character varying NOT NULL DEFAULT 'static'`);
        await queryRunner.query(`ALTER TABLE "revenue" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "revenue" ADD CONSTRAINT "UQ_bcce27e9c880edcfddbb8b3fcd3" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "company" ADD "nationality" character varying`);
        await queryRunner.query(`ALTER TABLE "company" ADD "city" character varying(256) NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."company_company_type_enum" AS ENUM('General', 'NGOs')`);
        await queryRunner.query(`ALTER TABLE "company" ADD "company_type" "public"."company_company_type_enum" NOT NULL DEFAULT 'General'`);
        await queryRunner.query(`ALTER TABLE "individual" ADD "nationality" character varying`);
        await queryRunner.query(`ALTER TABLE "individual" ADD "college" character varying`);
        await queryRunner.query(`ALTER TABLE "individual" ADD "unviresty" character varying`);
        await queryRunner.query(`ALTER TABLE "student_activity" ADD "college" character varying(256) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "student_activity" ADD "unviresty" character varying(256) NOT NULL`);
        await queryRunner.query(`DROP TABLE "lookups"`);
        await queryRunner.query(`DROP TYPE "public"."lookups_module_enum"`);
    }

}
