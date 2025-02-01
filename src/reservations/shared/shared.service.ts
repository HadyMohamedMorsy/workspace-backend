import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateSharedDto } from "./dto/create-shared.dto";
import { UpdateSharedDto } from "./dto/update-shared.dto";
import { Shared } from "./shared.entity";

@Injectable()
export class SharedService {
  constructor(
    @InjectRepository(Shared)
    private sharedRepository: Repository<Shared>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  async create(createSharedDto: CreateSharedDto) {
    const shared = this.sharedRepository.create(createSharedDto);
    return await this.sharedRepository.save(shared);
  }

  async findAll(filterData) {
    const filteredRecord = await this.apiFeaturesService
      .setRepository(Shared)
      .getFilteredData(filterData);
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findOne(id: number): Promise<Shared> {
    const shared = await this.sharedRepository.findOne({ where: { id } });
    if (!shared) {
      throw new NotFoundException(`${shared} with id ${id} not found`);
    }
    return shared;
  }

  async update(updateSharedDto: UpdateSharedDto) {
    await this.sharedRepository.update(updateSharedDto.id, updateSharedDto);
    return this.sharedRepository.findOne({ where: { id: updateSharedDto.id } });
  }

  async remove(sharedId: number) {
    await this.sharedRepository.delete(sharedId);
  }
}
