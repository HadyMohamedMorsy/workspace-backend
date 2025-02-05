import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateGeneralOfferDto } from "./dto/create-general-offer.dto";
import { UpdateGeneralOfferDto } from "./dto/update-general-offer.dto";
import { GeneralOffer } from "./generalOffer.entity";

@Injectable()
export class GeneralOfferService {
  constructor(
    @InjectRepository(GeneralOffer)
    private generalOfferRepository: Repository<GeneralOffer>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  // Create a new record
  async create(createGeneralOfferDto: CreateGeneralOfferDto): Promise<GeneralOffer> {
    const generalOffer = this.generalOfferRepository.create(createGeneralOfferDto);
    return await this.generalOfferRepository.save(generalOffer);
  }

  async findList() {
    const offers = await this.generalOfferRepository.find({});
    return {
      data: offers,
    };
  }

  // Get all records
  async findAll(filterData) {
    this.apiFeaturesService.setRepository(GeneralOffer);

    const queryBuilder = this.apiFeaturesService.setRepository(GeneralOffer).buildQuery(filterData);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<GeneralOffer> {
    return this.generalOfferRepository.findOne({ where: { id } });
  }

  // Update a record
  async update(updateGeneralOfferDto: UpdateGeneralOfferDto) {
    await this.generalOfferRepository.update(updateGeneralOfferDto.id, updateGeneralOfferDto);
    return this.generalOfferRepository.findOne({ where: { id: updateGeneralOfferDto.id } });
  }

  // Delete a record
  async remove(id: number) {
    await this.generalOfferRepository.delete(id);
  }
}
