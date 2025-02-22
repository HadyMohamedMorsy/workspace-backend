import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateExpensePlaceDto } from "./dto/create-expense-place.dto";
import { UpdateExpensePlaceDto } from "./dto/update-expense-place.dto";
import { ExpensePlace } from "./expense-place.entity";

@Injectable()
export class ExpensesPlaceService {
  constructor(
    @InjectRepository(ExpensePlace)
    private expensesPlaceRepository: Repository<ExpensePlace>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  // Create a new record
  async create(createExpenseSalariesDto: CreateExpensePlaceDto): Promise<ExpensePlace> {
    const ExpensesSalaries = this.expensesPlaceRepository.create(createExpenseSalariesDto);
    return await this.expensesPlaceRepository.save(ExpensesSalaries);
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(ExpensePlace).buildQuery(filterData);

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
  async findOne(id: number): Promise<ExpensePlace> {
    const expensesSalaries = await this.expensesPlaceRepository.findOne({ where: { id } });
    if (!expensesSalaries) {
      throw new NotFoundException(`${expensesSalaries} with id ${id} not found`);
    }
    return expensesSalaries;
  }

  // Update a record
  async update(updateExpensePlaceDto: UpdateExpensePlaceDto) {
    await this.expensesPlaceRepository.update(updateExpensePlaceDto.id, updateExpensePlaceDto);
    return this.expensesPlaceRepository.findOne({ where: { id: updateExpensePlaceDto.id } });
  }

  // Delete a record
  async remove(id: number) {
    await this.expensesPlaceRepository.delete(id);
  }
}
