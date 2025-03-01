import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssignGeneralOfferservice } from "src/assignes-global-offers/assignes-general-offer.service";
import { CreateAssignGeneralOfferDto } from "src/assignes-global-offers/dto/create-assign-general-offer.dto";
import { Company } from "src/companies/company.entity";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { Individual } from "src/individual/individual.entity";
import { RoomsService } from "src/rooms/rooms.service";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { Deals } from "./deals.entity";
import { CreateDealsDto } from "./dto/create-deals.dto";
import { UpdateDealsDto } from "./dto/update-deals.dto";

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deals)
    private dealsRepository: Repository<Deals>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly assignGlobalOffer: AssignGeneralOfferservice,
    protected readonly offer: GeneralOfferService,
    protected readonly roomService: RoomsService,
  ) {}

  async create(
    createDealsDto: CreateDealsDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ): Promise<Deals> {
    const room = await this.roomService.findOne(createDealsDto.room_id);

    const { customer_id, type_user, offer_id } = createDealsDto;
    let assignGeneralOffer = null;

    if (offer_id) {
      const payload = {
        customer_id,
        offer_id,
        type_user,
      } as CreateAssignGeneralOfferDto;

      assignGeneralOffer = await this.assignGlobalOffer.create(payload, reqBody);
    }

    const deals = this.dealsRepository.create({
      ...createDealsDto,
      room,
      assignGeneralOffer,
      createdBy: reqBody.createdBy,
      [type_user]: reqBody.customer,
    });

    return await this.dealsRepository.save(deals);
  }

  async findAll(filterData) {
    this.apiFeaturesService.setRepository(Deals);
    const queryBuilder = this.apiFeaturesService.setRepository(Deals).buildQuery(filterData);

    queryBuilder.leftJoin("e.createdBy", "ec").addSelect(["ec.id", "ec.firstName", "ec.lastName"]);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findDealsByIndividualAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deals).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
      .leftJoinAndSelect("e.room", "er")
      .andWhere("ei.id = :individual_id", { individual_id: filterData.individual_id })
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"]);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }
  async findDealsByComapnyAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deals).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.company", "ec")
      .leftJoinAndSelect("e.room", "er")
      .andWhere("ec.id = :company_id", { company_id: filterData.company_id })
      .leftJoin("e.createdBy", "ecc")
      .addSelect(["ecc.id", "ecc.firstName", "ecc.lastName"]);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }
  async findDealsByStudentActivityAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deals).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.studentActivity", "es")
      .leftJoinAndSelect("e.room", "er")
      .andWhere("es.id = :studentActivity_id", {
        studentActivity_id: filterData.studentActivity_id,
      })
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"]);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }
  async findDealsByUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deals).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.room", "er")
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"])
      .andWhere("ec.id = :user_id", {
        user_id: filterData.user_id,
      });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findOne(id: number): Promise<Deals> {
    return this.dealsRepository.findOne({ where: { id } });
  }

  async update(updateDealsDto: UpdateDealsDto) {
    await this.dealsRepository.update(updateDealsDto.id, updateDealsDto);
    return this.dealsRepository.findOne({ where: { id: updateDealsDto.id } });
  }

  async remove(id: number) {
    await this.dealsRepository.delete(id);
  }
}
