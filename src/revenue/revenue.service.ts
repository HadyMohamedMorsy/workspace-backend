import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateRevenueDto } from "./dto/create-revenue.dto";
import { UpdateRevenueDto } from "./dto/update-revenue.dto";
import { Revenue } from "./revenue.entity";

@Injectable()
export class RevenueService {
  constructor(
    @InjectRepository(Revenue)
    private revenueRepository: Repository<Revenue>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  async create(createRevenueDto: CreateRevenueDto): Promise<Revenue> {
    const revenue = this.revenueRepository.create(createRevenueDto);
    return await this.revenueRepository.save(revenue);
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Revenue).buildQuery(filterData);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<Revenue> {
    const revenue = await this.revenueRepository.findOne({ where: { id } });
    if (!revenue) {
      throw new NotFoundException(`${revenue} with id ${id} not found`);
    }
    return revenue;
  }

  async update(updateRevenueDto: UpdateRevenueDto) {
    await this.revenueRepository.update(updateRevenueDto.id, updateRevenueDto);
    return this.revenueRepository.findOne({ where: { id: updateRevenueDto.id } });
  }

  async remove(id: number) {
    await this.revenueRepository.delete(id);
  }
}
