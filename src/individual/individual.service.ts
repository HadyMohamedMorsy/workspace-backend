import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateIndividualDto } from "./dto/create-individual.dto";
import { UpdateIndividualDto } from "./dto/update-individual.dto";
import { Individual } from "./individual.entity";

@Injectable()
export class IndividualService {
  constructor(
    @InjectRepository(Individual)
    private individualRepository: Repository<Individual>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  // Create a new record
  async create(createIndividualDto: CreateIndividualDto): Promise<Individual> {
    const individual = this.individualRepository.create(createIndividualDto);
    return await this.individualRepository.save(individual);
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Individual).buildQuery(filterData);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }

  async findOne(id: number): Promise<Individual> {
    const individual = await this.individualRepository.findOne({ where: { id } });
    if (!individual) {
      throw new NotFoundException(`${individual} with id ${id} not found`);
    }
    return individual;
  }

  async update(updateIndividualDto: UpdateIndividualDto) {
    await this.individualRepository.update(updateIndividualDto.id, updateIndividualDto);
    return this.individualRepository.findOne({ where: { id: updateIndividualDto.id } });
  }

  async remove(id: number) {
    await this.individualRepository.delete(id);
  }
}
