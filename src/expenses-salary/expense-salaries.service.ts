import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GeneralSettingsService } from "src/general-settings/settings.service";
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
    private readonly setting: GeneralSettingsService,
  ) {}

  // Create a new record
  async create(createExpensesSalariesDto: CreateExpenseSalariesDto): Promise<ExpenseSalaries> {
    const { user_id, type_sallary, sallary } = createExpensesSalariesDto;

    const user =
      type_sallary === TypeSallary.Internal ? await this.validateUser(user_id) : undefined;
    // Calculate values once
    const annual = await this.calcAnnual(+sallary, user_id);
    const updatedSalary = +sallary + annual;
    const netSallary = updatedSalary + this.calcNetSallary(createExpensesSalariesDto);
    // Create base entity
    const expensesSalaries = this.expensesSalariesRepository.create({
      ...createExpensesSalariesDto,
      annual,
      net_sallary: netSallary,
      ...(user && { user }),
    });

    return this.expensesSalariesRepository.save(expensesSalaries);
  }

  private async validateUser(userId: number): Promise<User> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
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

  calcNetSallary(createExpensesSalariesDto: CreateExpenseSalariesDto) {
    return (
      (createExpensesSalariesDto.incentives ?? 0) +
      (createExpensesSalariesDto.rewards ?? 0) -
      (createExpensesSalariesDto.discounts ?? 0)
    );
  }

  async calcAnnual(salary: number, userId?: number) {
    const currentDate = new Date();
    const settings = await this.setting.findAll({});
    if (currentDate.getMonth() === 0) {
      return salary * (settings[0].annual_increase / 100);
    }

    if (userId) {
      const lastAnnualRecord = await this.expensesSalariesRepository.findOne({
        where: { user: { id: userId } },
        order: { created_at: "DESC" },
        select: ["user"],
      });

      return lastAnnualRecord?.annual || 0;
    }

    return 0;
  }
}
