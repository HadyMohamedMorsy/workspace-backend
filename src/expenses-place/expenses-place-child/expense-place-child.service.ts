import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateExpensePlaceChildDto } from "./dto/create-expense-place-child.dto";
import { UpdateExpensePlaceChildDto } from "./dto/update-expense-place-child.dto";
import { ExpensePlaceChild } from "./expense-place-child.entity";

@Injectable()
export class ExpensesPlaceChildService {
  constructor(
    @InjectRepository(ExpensePlaceChild)
    private expensesPlaceChildRepository: Repository<ExpensePlaceChild>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  // Create a new record
  async create(createExpensePlaceChildDto: CreateExpensePlaceChildDto): Promise<ExpensePlaceChild> {
    const ExpensesSalaries = this.expensesPlaceChildRepository.create(createExpensePlaceChildDto);
    return await this.expensesPlaceChildRepository.save(ExpensesSalaries);
  }

  // Get all records
  async findAll(filterData) {
    this.apiFeaturesService.setRepository(ExpensePlaceChild);

    const filteredRecord = await this.apiFeaturesService.getFilteredData(filterData, {
      relations: ["expensePlace"],
      findRelated: { moduleName: "expensePlace", id: filterData.expensePlace_id },
    });

    const totalRecords = await this.apiFeaturesService.getTotalDocs();

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
    await this.expensesPlaceChildRepository.update(
      updateExpensePlaceChildDto.id,
      updateExpensePlaceChildDto,
    );
    return this.expensesPlaceChildRepository.findOne({
      where: { id: updateExpensePlaceChildDto.id },
    });
  }

  // Delete a record
  async remove(id: number) {
    await this.expensesPlaceChildRepository.delete(id);
  }
}
