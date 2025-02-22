import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateGeneralOfferDto } from "./dto/create-general-offer.dto";
import { UpdateGeneralOfferDto } from "./dto/update-general-offer.dto";
import { PRODUCT_TYPE } from "./enum/product.enum";
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

  async findShared() {
    const now = moment();

    const offers = await this.generalOfferRepository
      .createQueryBuilder("offer")
      .where("offer.product = :productType", { productType: PRODUCT_TYPE.Shared })
      .andWhere("offer.start_date <= :now AND offer.end_date > :now", {
        now: now.toDate(),
      })
      .getMany();
    return {
      data: offers,
    };
  }
  async findDeskArea() {
    const now = moment();

    const offers = await this.generalOfferRepository
      .createQueryBuilder("offer")
      .where("offer.product = :productType", { productType: PRODUCT_TYPE.Deskarea })
      .andWhere("offer.start_date <= :now AND offer.end_date > :now", {
        now: now.toDate(),
      })
      .getMany();

    return {
      data: offers,
    };
  }
  async findRooms() {
    const now = moment();

    const offers = await this.generalOfferRepository
      .createQueryBuilder("offer")
      .where("offer.product = :productType", { productType: PRODUCT_TYPE.Room })
      .andWhere("offer.start_date <= :now AND offer.end_date > :now", {
        now: now.toDate(),
      })
      .getMany();

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

  async findOneRelatedIndividual(filterData: any) {
    this.apiFeaturesService.setRepository(GeneralOffer);

    const queryBuilder = this.apiFeaturesService.setRepository(GeneralOffer).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.assignessOffers", "ea")
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
      .leftJoinAndSelect("e.assignessOffers", "ea")
      .leftJoinAndSelect("ea.company", "ec")
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

  async findOneRelatedStudentActivity(filterData: any) {
    this.apiFeaturesService.setRepository(GeneralOffer);

    const queryBuilder = this.apiFeaturesService.setRepository(GeneralOffer).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.assignessOffers", "ea")
      .leftJoinAndSelect("ea.studentActivity", "es")
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
