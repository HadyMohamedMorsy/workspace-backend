import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeSallary } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { User } from "src/users/user.entity";
import { UserService } from "src/users/user.service";
import { Repository } from "typeorm";
import { CreateExpenseSalariesDto } from "./dto/create-expense-salaries.dto";
import { UpdateExpenseSalariesDto } from "./dto/update-expense-salaries.dto";
import { ExpenseSalaries } from "./expense-salaries.entity";

@Injectable()
export class ExpensesSalariesService {
  constructor(
    @InjectRepository(ExpenseSalaries)
    private expensesSalariesRepository: Repository<ExpenseSalaries>,
    protected readonly apiFeaturesService: APIFeaturesService,
    private readonly usersService: UserService,
  ) {}

  // Create a new record
  async create(createExpensesSalariesDto: CreateExpenseSalariesDto): Promise<ExpenseSalaries> {
    let user: User | null = null;
    let expensesSalaries: ExpenseSalaries | null = null;

    if (createExpensesSalariesDto.type_sallary === TypeSallary.Internal) {
      user = await this.usersService.findOneById(createExpensesSalariesDto.user_id);
      if (!user) {
        throw new NotFoundException(`user is not found `);
      }

      expensesSalaries = this.expensesSalariesRepository.create({
        ...createExpensesSalariesDto,
        user,
      });
    } else {
      expensesSalaries = this.expensesSalariesRepository.create(createExpensesSalariesDto);
    }

    return await this.expensesSalariesRepository.save(expensesSalaries);
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ExpenseSalaries)
      .buildQuery(filterData);

    queryBuilder
      .leftJoin("e.user", "ep")
      .addSelect(["ep.id", "ep.firstName", "ep.lastName", "ep.phone"]);

    if (filterData?.customFilters?.start_date && filterData?.customFilters?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: filterData.customFilters.start_date,
        end_date: filterData.customFilters.end_date,
      });
    }
    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findByUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ExpenseSalaries)
      .buildQuery(filterData);

    queryBuilder
      .leftJoin("e.user", "ep")
      .addSelect(["ep.id", "ep.firstName", "ep.lastName", "ep.phone"])
      .andWhere("ep.id = :user_id", { user_id: filterData.user_id });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<ExpenseSalaries> {
    const expensesSalaries = await this.expensesSalariesRepository.findOne({ where: { id } });
    if (!expensesSalaries) {
      throw new NotFoundException(`${expensesSalaries} with id ${id} not found`);
    }
    return expensesSalaries;
  }

  // Update a record
  async update(updateExpensesSalariesDto: UpdateExpenseSalariesDto) {
    let user: User | null = null;
    const { user_id, ...updateDto } = updateExpensesSalariesDto;

    if (updateExpensesSalariesDto.type_sallary === TypeSallary.Internal) {
      user = await this.usersService.findOneById(user_id);
      if (!user) {
        throw new NotFoundException(`user is not found `);
      }

      await this.expensesSalariesRepository.update(updateDto.id, {
        ...updateDto,
        user,
      });
    } else {
      await this.expensesSalariesRepository.update(updateDto.id, updateDto);
    }
    return this.expensesSalariesRepository.findOne({
      where: { id: updateExpensesSalariesDto.id },
      relations: ["user"],
    });
  }

  // Delete a record
  async remove(id: number) {
    await this.expensesSalariesRepository.delete(id);
  }
}
