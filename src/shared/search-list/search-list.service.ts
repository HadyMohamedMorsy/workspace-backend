import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { Repository } from "typeorm";

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(StudentActivity)
    private readonly studentActivityRepository: Repository<StudentActivity>,
    @InjectRepository(Individual)
    private readonly individualRepository: Repository<Individual>,
  ) {}

  async search(module: string, query: string) {
    if (!query) {
      throw new Error("Query must not be empty.");
    }

    // Handle different modules
    switch (module) {
      case "company":
        return await this.searchCompanies(query);
      case "studentActivity":
        return await this.searchStudentActivity(query);
      case "individual":
        return await this.searchIndividual(query);

      // Add other modules here as needed
      default:
        throw new Error(`Unsupported module: ${module}`);
    }
  }

  private async searchStudentActivity(query: string) {
    const results = await this.studentActivityRepository
      .createQueryBuilder("studentActivity")
      .where("studentActivity.name ILIKE :query", { query: `%${query}%` })
      .getMany();

    // Map results to the required format
    return {
      data: results.map(studentActivity => ({
        label: studentActivity.name,
        value: studentActivity.id,
        ...studentActivity,
      })),
    };
  }

  private async searchIndividual(query: string) {
    const results = await this.individualRepository
      .createQueryBuilder("individual")
      .where("studentActivity.name ILIKE :query", { query: `%${query}%` })
      .orWhere("studentActivity.whatsApp ILIKE :query", { query: `%${query}%` })
      .orWhere("studentActivity.number ILIKE :query", { query: `%${query}%` })
      .getMany();

    // Map results to the required format
    return {
      data: results.map(studentActivity => ({
        label: studentActivity.name,
        value: studentActivity.id,
        ...studentActivity,
      })),
    };
  }
  private async searchCompanies(query: string) {
    const results = await this.companyRepository
      .createQueryBuilder("company")
      .where("company.name ILIKE :query", { query: `%${query}%` })
      .orWhere("company.whatsApp ILIKE :query", { query: `%${query}%` })
      .orWhere("company.phone ILIKE :query", { query: `%${query}%` })
      .getMany();

    // Map results to the required format
    return {
      data: results.map(company => ({
        label: company.name,
        value: company.id,
        ...company,
      })),
    };
  }
}
