import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GeneralOffer } from "src/general-offer/generalOffer.entity";
import { RoomsService } from "src/rooms/rooms.service";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateOfferPackagesDto } from "./dto/create-offer-packages.dto";
import { UpdateOfferPackagesDto } from "./dto/update-offer-packages.dto";
import { OfferPackages } from "./offer-package.entity.ts";

@Injectable()
export class OfferPackagesService {
  constructor(
    @InjectRepository(OfferPackages)
    private offerpackagesRepository: Repository<OfferPackages>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly roomService: RoomsService,
  ) {}

  // Create a new record
  async create(createOfferpackagesDto: CreateOfferPackagesDto): Promise<OfferPackages> {
    const room = await this.roomService.findOne(createOfferpackagesDto.room_id);
    const offerpackages = this.offerpackagesRepository.create({
      ...createOfferpackagesDto,
      room,
    });
    return await this.offerpackagesRepository.save(offerpackages);
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(OfferPackages)
      .buildQuery(filterData);

    queryBuilder.leftJoin("e.room", "er").addSelect(["er.id", "er.name"]);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findList() {
    const offers = await this.offerpackagesRepository.find({});
    return {
      data: offers,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<OfferPackages> {
    return this.offerpackagesRepository.findOne({ where: { id } });
  }

  async findOneRelatedIndividual(filterData: any) {
    this.apiFeaturesService.setRepository(GeneralOffer);

    const queryBuilder = this.apiFeaturesService.setRepository(GeneralOffer).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.assignesPackages", "ea")
      .leftJoinAndSelect("ea.individual", "ei")
      .andWhere("e.id = :offer_id", {
        offer_id: filterData.id,
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
      .leftJoinAndSelect("e.assignesPackages", "ea")
      .leftJoinAndSelect("ea.company", "ec")
      .andWhere("e.id = :offer_package_id", {
        offer_package_id: filterData.id,
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
      .leftJoinAndSelect("e.assignesPackages", "ea")
      .leftJoinAndSelect("ea.studentActivity", "es")
      .andWhere("e.id = :offer_package_id", {
        offer_package_id: filterData.id,
      });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }
  async findOneRelatedRoom(filterData: any) {
    this.apiFeaturesService.setRepository(GeneralOffer);

    const queryBuilder = this.apiFeaturesService.setRepository(GeneralOffer).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.assignesPackages", "ea")
      .leftJoinAndSelect("ea.room", "es")
      .andWhere("e.id = :offer_package_id", {
        offer_package_id: filterData.id,
      });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Update a record
  async update(updateOfferpackagesDto: UpdateOfferPackagesDto) {
    const room = await this.roomService.findOne(updateOfferpackagesDto.room_id);

    await this.offerpackagesRepository.update(updateOfferpackagesDto.id, {
      ...updateOfferpackagesDto,
      room,
    });
    return this.offerpackagesRepository.findOne({ where: { id: updateOfferpackagesDto.id } });
  }

  // Delete a record
  async remove(id: number) {
    await this.offerpackagesRepository.delete(id);
  }
}
