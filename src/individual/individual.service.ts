import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReservationStatus } from "src/shared/enum/global-enum";
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
    if (individual) {
      const newClient = await this.individualRepository.save(individual);
      return this.findOne(newClient.id);
    }
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Individual).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.assign_memberships", "ep", "ep.status = :status_memeber", {
        status_memeber: ReservationStatus.ACTIVE,
      })
      .leftJoinAndSelect("ep.memeberShip", "ms")
      .leftJoinAndSelect("e.assignesPackages", "es", "es.status = :status_package", {
        status_package: ReservationStatus.ACTIVE,
      })
      .leftJoinAndSelect("es.packages", "pa")
      .leftJoinAndSelect("pa.room", "pr")
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"])
      .leftJoinAndSelect("e.orders", "eo", "eo.type_order = :typeOrder", {
        typeOrder: "HOLD",
      });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }
  async findByUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Individual).buildQuery(filterData);

    queryBuilder
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"])
      .andWhere("ec.id = :user_id", { user_id: filterData.user_id });

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
    const individual = await this.individualRepository.findOne({
      where: { id },
      relations: ["assignGeneralOffers", "assign_memberships", "assignesPackages", "createdBy"],
    });
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
