import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GeneralOffer } from "src/general-offer/generalOffer.entity";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateCoWorkingSpaceDto } from "./dto/create-offer-co-working-space.dto";
import { UpdateCoWorkingSpaceDto } from "./dto/update-offer-co-working-space.dto";
import { CoWorkingSpace } from "./offer-co-working-space.entity.ts";

@Injectable()
export class OfferCoWorkingSpaceService {
  constructor(
    @InjectRepository(CoWorkingSpace)
    private offerCoWorkingSpaceRepository: Repository<CoWorkingSpace>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  // Create a new record
  async create(createCoWorkingSpaceDto: CreateCoWorkingSpaceDto): Promise<CoWorkingSpace> {
    const generalOffer = this.offerCoWorkingSpaceRepository.create(createCoWorkingSpaceDto);
    return await this.offerCoWorkingSpaceRepository.save(generalOffer);
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(CoWorkingSpace)
      .buildQuery(filterData);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findList() {
    const offers = await this.offerCoWorkingSpaceRepository.find({});
    return {
      data: offers,
    };
  }

  async findOneRelatedIndividual(filterData: any) {
    this.apiFeaturesService.setRepository(GeneralOffer);

    const queryBuilder = this.apiFeaturesService.setRepository(GeneralOffer).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.assignessMemebership", "ea")
      .leftJoinAndSelect("ea.individual", "ei")
      .andWhere("e.id = :memeber_id", {
        memeber_id: filterData.id,
      });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findOneRelatedCompany(filterData: any) {
    this.apiFeaturesService.setRepository(GeneralOffer);

    const queryBuilder = this.apiFeaturesService.setRepository(GeneralOffer).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.assignessMemebership", "ea")
      .leftJoinAndSelect("ea.company", "ec")
      .andWhere("e.id = :memeber_id", {
        memeber_id: filterData.id,
      });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findOneRelatedStudentActivity(filterData: any) {
    this.apiFeaturesService.setRepository(GeneralOffer);

    const queryBuilder = this.apiFeaturesService.setRepository(GeneralOffer).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.assignessMemebership", "ea")
      .leftJoinAndSelect("ea.studentActivity", "es")
      .andWhere("e.id = :memeber_id", {
        memeber_id: filterData.id,
      });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findOneRelatedShared(filterData: any) {
    this.apiFeaturesService.setRepository(GeneralOffer);

    const queryBuilder = this.apiFeaturesService.setRepository(GeneralOffer).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.assignessMemebership", "ea")
      .leftJoinAndSelect("ea.shared", "ec")
      .andWhere("e.id = :memeber_id", {
        memeber_id: filterData.id,
      });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findOneRelatedDeskArea(filterData: any) {
    this.apiFeaturesService.setRepository(GeneralOffer);

    const queryBuilder = this.apiFeaturesService.setRepository(GeneralOffer).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.assignessMemebership", "ea")
      .leftJoinAndSelect("ea.deskarea", "ec")
      .andWhere("e.id = :memeber_id", {
        memeber_id: filterData.id,
      });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<CoWorkingSpace> {
    return this.offerCoWorkingSpaceRepository.findOne({ where: { id } });
  }

  // Update a record
  async update(updateGeneralOfferDto: UpdateCoWorkingSpaceDto) {
    await this.offerCoWorkingSpaceRepository.update(
      updateGeneralOfferDto.id,
      updateGeneralOfferDto,
    );
    return this.offerCoWorkingSpaceRepository.findOne({ where: { id: updateGeneralOfferDto.id } });
  }

  // Delete a record
  async remove(id: number) {
    await this.offerCoWorkingSpaceRepository.delete(id);
  }
}
