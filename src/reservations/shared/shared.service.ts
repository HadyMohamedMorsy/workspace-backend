import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssignGeneralOfferservice } from "src/assignes-global-offers/assignes-general-offer.service";
import { CreateAssignGeneralOfferDto } from "src/assignes-global-offers/dto/create-assign-general-offer.dto";
import { AssignesMembershipService } from "src/assignes-memberships/assignes-membership.service";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
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
    protected readonly globalOffer: AssignGeneralOfferservice,
    protected readonly membership: AssignesMembershipService,
  ) {}

  async create(
    createSharedDto: CreateSharedDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ) {
    const { customer_id, type_user, offer_id, membership_id } = createSharedDto;
    const isReservation = await this.findActiveOrInactiveReservationsForCustomer(
      customer_id,
      type_user,
    );
    if (isReservation && isReservation.length) {
      throw new BadRequestException(`u can't reservation again for this user`);
    }

    let generalOffer = null;
    let memberShip = null;

    if (offer_id) {
      const payload = {
        customer_id,
        offer_id,
        type_user,
      } as CreateAssignGeneralOfferDto;

      generalOffer = await this.globalOffer.create(payload, reqBody);
    }

    if (membership_id) {
      const memebership = await this.membership.findOne(membership_id);
      memberShip = memebership;
    }

    const shared = this.sharedRepository.create({
      ...createSharedDto,
      assignGeneralOffer: generalOffer,
      assignessMemebership: memberShip,
      createdBy: reqBody.createdBy,
      [type_user.toLowerCase()]: reqBody.customer,
    });
    return await this.sharedRepository.save(shared);
  }

  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Shared).buildQuery(filterData);
    queryBuilder.leftJoin("e.createdBy", "ec").addSelect(["ec.id", "ec.firstName", "ec.lastName"]);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();
    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findActiveOrInactiveReservationsForCustomer(customer_id: number, customer_type: string) {
    const customerRelationMap = {
      individual: "individual",
      company: "company",
      studentActivity: "studentActivity",
    };

    const customerRelationField = customerRelationMap[customer_type];
    const customerCondition = { [customerRelationField]: { id: customer_id } };

    const existingReservations = await this.sharedRepository.find({
      relations: [customerRelationField],
      where: [
        {
          status: ReservationStatus.ACTIVE,
          ...customerCondition,
        },
      ],
    });

    return existingReservations;
  }

  async findOne(id: number): Promise<Shared> {
    const shared = await this.sharedRepository.findOne({ where: { id } });
    if (!shared) {
      throw new NotFoundException(`${shared} with id ${id} not found`);
    }
    return shared;
  }

  async findSharedByIndividualAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Shared).buildQuery(filterData);
    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
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
  async findSharedByComapnyAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Shared).buildQuery(filterData);
    queryBuilder
      .leftJoinAndSelect("e.company", "ec")
      .andWhere("ec.id = :company_id", { company_id: filterData.company_id })
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
  async findSharedByStudentActivityAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Shared).buildQuery(filterData);
    queryBuilder
      .leftJoinAndSelect("e.studentActivity", "es")
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
  async findSharedByUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Shared).buildQuery(filterData);
    queryBuilder
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

  async update(updateSharedDto: UpdateSharedDto) {
    if (updateSharedDto.status === ReservationStatus.CANCELLED) {
      await this.sharedRepository.update(updateSharedDto.id, updateSharedDto);
    } else {
      const { start_hour, start_minute, start_time, end_hour, end_minute, end_time } =
        updateSharedDto;

      const startTotalMinutes = this.convertToMinutes(start_hour, start_minute, start_time);
      const endTotalMinutes = this.convertToMinutes(end_hour, end_minute, end_time);
      const durationMinutes = endTotalMinutes - startTotalMinutes;

      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;

      let totalPrice = hours * 10;
      if (minutes >= 10) {
        totalPrice += 10;
      }

      await this.sharedRepository.update(updateSharedDto.id, {
        ...updateSharedDto,
        total_price: totalPrice,
        status: ReservationStatus.COMPLETE,
      });
    }
    return this.sharedRepository.findOne({ where: { id: updateSharedDto.id } });
  }

  async remove(sharedId: number) {
    await this.sharedRepository.delete(sharedId);
  }

  convertToMinutes(hour, minute, period) {
    if (period === "pm" && hour !== 12) {
      hour += 12;
    }
    if (period === "am" && hour === 12) {
      hour = 0;
    }
    return hour * 60 + minute;
  }
}
