import { ConflictException, Injectable } from "@nestjs/common";
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
    try {
      const individual = this.individualRepository.create(createIndividualDto);
      return await this.individualRepository.save(individual);
    } catch (error) {
      if (error.code === "23505") {
        if (error.constraint === "UQ_6236cfa94a940a14729b69d4e64") {
          throw new ConflictException("The phone number is already taken.");
        } else if (error.constraint === "UQ_589d633a38525c92dd87f1ee93b") {
          throw new ConflictException("The WhatsApp number is already registered.");
        }
      }
      throw error;
    }
  }

  // Get all records
  async findAll(filterData) {
    this.apiFeaturesService.setRepository(Individual);
    const filteredRecord = await this.apiFeaturesService.getFilteredData(filterData);
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findOne(id: number): Promise<Individual> {
    return this.individualRepository.findOne({ where: { id } });
  }

  async update(updateIndividualDto: UpdateIndividualDto) {
    await this.individualRepository.update(updateIndividualDto.id, updateIndividualDto);
    return this.individualRepository.findOne({ where: { id: updateIndividualDto.id } });
  }

  async remove(id: number) {
    await this.individualRepository.delete(id);
  }
}
