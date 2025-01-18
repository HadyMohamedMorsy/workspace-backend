import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "src/categories/category.entity";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
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
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
      case "user":
        return await this.searchUser(query);
      case "category":
        return await this.searchCategory(query);

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
  private async searchCategory(query: string) {
    const results = await this.categoryRepository
      .createQueryBuilder("category")
      .where("category.name ILIKE :query", { query: `%${query}%` })
      .getMany();

    // Map results to the required format
    return {
      data: results.map(category => ({
        label: category.name,
        value: category.id,
        ...category,
      })),
    };
  }

  private async searchIndividual(query: string) {
    const results = await this.individualRepository
      .createQueryBuilder("individual")
      .where("individual.name ILIKE :query", { query: `%${query}%` })
      .orWhere("individual.whatsApp ILIKE :query", { query: `%${query}%` })
      .orWhere("individual.number ILIKE :query", { query: `%${query}%` })
      .getMany();

    // Map results to the required format
    return {
      data: results.map(individual => ({
        label: individual.name,
        value: individual.id,
        ...individual,
      })),
    };
  }
  private async searchUser(query: string) {
    const results = await this.userRepository
      .createQueryBuilder("user")
      .where("user.firstName ILIKE :query", { query: `%${query}%` })
      .orWhere("user.lastName ILIKE :query", { query: `%${query}%` })
      .orWhere("user.username ILIKE :query", { query: `%${query}%` })
      .orWhere("user.email ILIKE :query", { query: `%${query}%` })
      .orWhere("user.phone ILIKE :query", { query: `%${query}%` })
      .getMany();

    // Map results to the required format
    return {
      data: results.map(user => ({
        label: user.firstName + " " + user.lastName,
        value: user.id,
        ...user,
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
