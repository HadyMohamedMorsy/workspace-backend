import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { Deals } from "./deals.entity";
import { CreateDealsDto } from "./dto/create-deals.dto";
import { UpdateDealsDto } from "./dto/update-deals.dto";

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deals)
    private dealsRepository: Repository<Deals>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  // Create a new record
  async create(createDealsDto: CreateDealsDto): Promise<Deals> {
    const deals = this.dealsRepository.create(createDealsDto);
    return await this.dealsRepository.save(deals);
  }

  // Get all records
  async findAll(filterData) {
    this.apiFeaturesService.setRepository(Deals);
    const filteredRecord = await this.apiFeaturesService.getFilteredData(filterData);
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<Deals> {
    return this.dealsRepository.findOne({ where: { id } });
  }

  // Update a record
  async update(updateDealsDto: UpdateDealsDto) {
    await this.dealsRepository.update(updateDealsDto.id, updateDealsDto);
    return this.dealsRepository.findOne({ where: { id: updateDealsDto.id } });
  }

  // Delete a record
  async remove(id: number) {
    await this.dealsRepository.delete(id);
  }
}
