import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { RevenueService } from "../revenue.service";
import { CreateRevenueChildDto } from "./dto/create-revenue-child.dto";
import { UpdateRevenueChildDto } from "./dto/update-revenue-child.dto";
import { RevenueChild } from "./revenue-child.entity";

@Injectable()
export class RevenueChildService {
  constructor(
    @InjectRepository(RevenueChild)
    private revenueChildRepository: Repository<RevenueChild>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly revenueService: RevenueService,
  ) {}

  // Create a new record
  async create(createRevenueChildDto: CreateRevenueChildDto): Promise<RevenueChild> {
    const revenue = await this.revenueService.findOne(createRevenueChildDto.revenueChild_id);
    const totalRevenue = (revenue.total || 0) + createRevenueChildDto.amount;
    revenue.total = totalRevenue;

    await this.revenueService.update({
      id: revenue.id,
      total: totalRevenue,
    });

    const revenueChild = this.revenueChildRepository.create({
      ...createRevenueChildDto,
      revenue: revenue,
    });

    return await this.revenueChildRepository.save(revenueChild);
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(RevenueChild).buildQuery(filterData);

    if (filterData.revenue_id) {
      queryBuilder.leftJoin("e.revenue", "r").andWhere("r.id = :revenue_id", {
        revenue_id: filterData.revenue_id,
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
  async findOne(id: number): Promise<RevenueChild> {
    const revenueChild = await this.revenueChildRepository.findOne({ where: { id } });
    if (!revenueChild) {
      throw new NotFoundException(`${revenueChild} with id ${id} not found`);
    }
    return revenueChild;
  }

  // Update a record
  async update(updateRevenueChildDto: UpdateRevenueChildDto) {
    const revenue = await this.revenueService.findOne(updateRevenueChildDto.revenueChild_id);

    const totalRevenue = (revenue.total || 0) + updateRevenueChildDto.amount;
    revenue.total = totalRevenue;

    await this.revenueService.update({
      id: revenue.id,
      total: totalRevenue,
    });

    await this.revenueChildRepository.update(updateRevenueChildDto.id, {
      ...updateRevenueChildDto,
      revenue: revenue,
    });

    return this.revenueChildRepository.findOne({
      where: { id: updateRevenueChildDto.id },
    });
  }

  // Delete a record
  async remove(id: number) {
    await this.revenueChildRepository.delete(id);
  }
}
