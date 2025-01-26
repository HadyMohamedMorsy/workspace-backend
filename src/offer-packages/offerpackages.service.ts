import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
    this.apiFeaturesService.setRepository(OfferPackages);
    const filteredRecord = await this.apiFeaturesService.getFilteredData({
      ...filterData,
      relations: ["room"],
    });
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<OfferPackages> {
    return this.offerpackagesRepository.findOne({ where: { id } });
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
