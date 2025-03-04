import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { ExpensesPlaceService } from "../expense-place.service";
import { CreateExpensePlaceChildDto } from "./dto/create-expense-place-child.dto";
import { UpdateExpensePlaceChildDto } from "./dto/update-expense-place-child.dto";
import { ExpensePlaceChild } from "./expense-place-child.entity";

@Injectable()
export class ExpensesPlaceChildService {
  constructor(
    @InjectRepository(ExpensePlaceChild)
    private expensesPlaceChildRepository: Repository<ExpensePlaceChild>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly expenseService: ExpensesPlaceService,
  ) {}

  // Create a new record
  async create(createExpensePlaceChildDto: CreateExpensePlaceChildDto): Promise<ExpensePlaceChild> {
    const expenses = await this.expenseService.findOne(createExpensePlaceChildDto.expensePlace_id);
    const totalExpense = (expenses.total || 0) + createExpensePlaceChildDto.cost;
    expenses.total = totalExpense;

    await this.expenseService.update({
      id: expenses.id,
      total: totalExpense,
    });

    const expensesSalaries = this.expensesPlaceChildRepository.create({
      ...createExpensePlaceChildDto,
      expensePlace: expenses,
    });

    return await this.expensesPlaceChildRepository.save(expensesSalaries);
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ExpensePlaceChild)
      .buildQuery(filterData);

    if (filterData.expensePlace_id) {
      queryBuilder.leftJoin("e.expensePlace", "ep").andWhere("ep.id = :expenseplace_id", {
        expenseplace_id: filterData.expensePlace_id,
      });
    }
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

  // Get record by ID
  async findOne(id: number): Promise<ExpensePlaceChild> {
    const expensesSalaries = await this.expensesPlaceChildRepository.findOne({ where: { id } });
    if (!expensesSalaries) {
      throw new NotFoundException(`${expensesSalaries} with id ${id} not found`);
    }
    return expensesSalaries;
  }

  // Update a record
  async update(updateExpensePlaceChildDto: UpdateExpensePlaceChildDto) {
    const expenses = await this.expenseService.findOne(updateExpensePlaceChildDto.expensePlace_id);

    const totalExpense = (expenses.total || 0) + updateExpensePlaceChildDto.cost;
    expenses.total = totalExpense;

    await this.expenseService.update({
      id: expenses.id,
      total: totalExpense,
    });

    await this.expensesPlaceChildRepository.update(updateExpensePlaceChildDto.id, {
      ...updateExpensePlaceChildDto,
      expensePlace: expenses,
    });

    return this.expensesPlaceChildRepository.findOne({
      where: { id: updateExpensePlaceChildDto.id },
    });
  }

  // Delete a record
  async remove(id: number) {
    await this.expensesPlaceChildRepository.delete(id);
  }
}
