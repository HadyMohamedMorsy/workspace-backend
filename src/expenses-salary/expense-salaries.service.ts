import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
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
    const user = await this.usersService.findOneById(createExpensesSalariesDto.user_id);
    if (!user) {
      throw new NotFoundException(`user is not found `);
    }

    const ExpensesSalaries = this.expensesSalariesRepository.create({
      ...createExpensesSalariesDto,
      user,
    });

    return await this.expensesSalariesRepository.save(ExpensesSalaries);
  }

  // Get all records
  async findAll(filterData) {
    const filteredRecord = await this.apiFeaturesService
      .setRepository(ExpenseSalaries)
      .getFilteredData({
        ...filterData,
        relations: ["user"],
      });
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

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
    const { user_id, ...updateDto } = updateExpensesSalariesDto; // Destructure correctly

    const user = await this.usersService.findOneById(user_id);
    if (!user) {
      throw new NotFoundException(`user is not found `);
    }

    await this.expensesSalariesRepository.update(updateDto.id, {
      ...updateDto,
      user,
    });
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
