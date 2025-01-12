import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/categories/category.entity";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { SearchController } from "./search-controller";
import { SearchService } from "./search-list.service";

@Global() // Marks this module as global
@Module({
  imports: [TypeOrmModule.forFeature([StudentActivity, Company, Individual, Category])],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
