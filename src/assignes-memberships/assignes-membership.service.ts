import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssignGeneralOfferservice } from "src/assignes-global-offers/assignes-general-offer.service";
import { CreateAssignGeneralOfferDto } from "src/assignes-global-offers/dto/create-assign-general-offer.dto";
import { Company } from "src/companies/company.entity";
import { DepositeService } from "src/deposit/deposites.service";
import { CreateDepositeDto } from "src/deposit/dto/create-deposites.dto";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { Individual } from "src/individual/individual.entity";
import { OfferCoWorkingSpaceService } from "src/offer-co-working-space/offer-co-working-space.service";
import { DeskareaService } from "src/reservations/deskarea/deskarea.service";
import { SharedService } from "src/reservations/shared/shared.service";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { AssignesMembership } from "./assignes-membership.entity";
import { CreateAssignesMembershipDto } from "./dto/create-assignes-membership.dto";
import { UpdateAssignesMembershipDto } from "./dto/update-assignes-membership.dto";

@Injectable()
export class AssignesMembershipService {
  constructor(
    @InjectRepository(AssignesMembership)
    private assignesMembershipRepository: Repository<AssignesMembership>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly assignGlobalOffer: AssignGeneralOfferservice,
    protected readonly offer: GeneralOfferService,
    protected readonly offerCoWorkingSpaceService: OfferCoWorkingSpaceService,
    protected readonly depositeService: DepositeService,
    @Inject(forwardRef(() => SharedService))
    private readonly shared: SharedService,

    @Inject(forwardRef(() => DeskareaService))
    private readonly deskarea: DeskareaService,
  ) {}

  // Create a new record
  async create(
    create: CreateAssignesMembershipDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ): Promise<AssignesMembership> {
    const memeberShip = await this.offerCoWorkingSpaceService.findOne(create.membership_id);

    if (!memeberShip) {
      throw new NotFoundException(`${memeberShip} with  not found`);
    }

    const { customer_id, type_user, offer_id } = create;
    let assignGeneralOffer = null;

    if (offer_id) {
      const payload = {
        customer_id,
        offer_id,
        type_user,
      } as CreateAssignGeneralOfferDto;

      assignGeneralOffer = await this.assignGlobalOffer.create(payload, reqBody);
    }

    const totalPrice = await this.calculateCoWrokingSpaceTotalPrice(offer_id, memeberShip.price);

    const assignesMembership = this.assignesMembershipRepository.create({
      ...create,
      createdBy: reqBody.createdBy,
      total_used: +memeberShip.days,
      total_price: totalPrice,
      assignGeneralOffer,
      used: 0,
      remaining: +memeberShip.days,
      [create.type_user]: reqBody.customer,
      memeberShip,
    });

    const newMember = await this.assignesMembershipRepository.save(assignesMembership);
    return await this.findOne(newMember.id);
  }
  // Create a new record
  async createDeposite(create: CreateDepositeDto, createdBy: User) {
    const { entity_id } = create;

    try {
      const assignMembership = await this.findOne(entity_id);

      if (!assignMembership) {
        throw new NotFoundException(`${assignMembership} with  not found`);
      }
      const payload: CreateDepositeDto = {
        ...create,
        createdBy,
        assignMembership,
      };

      const deposite = await this.depositeService.create(payload);

      // Validate deposit amount
      if (!deposite || deposite.total_price >= assignMembership.total_price) {
        throw new BadRequestException(
          `Deposit amount (${deposite?.total_price}) must be less than assignment total price (${assignMembership.total_price})`,
        );
      }

      return await this.updateEntity({
        id: entity_id,
        deposites: deposite,
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
    }
  }

  // Get a single record by ID
  async findOne(id: number) {
    const assignesMembership = await this.assignesMembershipRepository.findOne({
      where: { id },
      relations: ["memeberShip"],
    });
    if (!assignesMembership) {
      throw new NotFoundException(`AssignesMembership with id ${id} not found`);
    }
    return assignesMembership;
  }

  async findAssignesByUser(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(AssignesMembership)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.memeberShip", "em")
      .leftJoinAndSelect("e.shared", "es")
      .leftJoinAndSelect("e.deskarea", "ed")
      .leftJoinAndSelect("e.assignGeneralOffer", "ess")
      .leftJoinAndSelect("ess.generalOffer", "eg")
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

  async findAssignesByIndividual(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(AssignesMembership)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
      .leftJoinAndSelect("e.memeberShip", "em")
      .leftJoinAndSelect("e.shared", "es")
      .leftJoinAndSelect("e.deposites", "esdep")
      .leftJoinAndSelect("e.deskarea", "ed")
      .leftJoinAndSelect("e.assignGeneralOffer", "ess")
      .leftJoinAndSelect("ess.generalOffer", "eg")
      .andWhere("ei.id = :individual_id", { individual_id: filterData.individual_id })
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"]);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }
  async findAssignesByCompany(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(AssignesMembership)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.company", "ec")
      .leftJoinAndSelect("e.memeberShip", "em")
      .leftJoinAndSelect("e.shared", "es")
      .leftJoinAndSelect("e.deposites", "esdep")
      .leftJoinAndSelect("e.deskarea", "ed")
      .leftJoinAndSelect("e.assignGeneralOffer", "ess")
      .leftJoinAndSelect("ess.generalOffer", "eg")
      .andWhere("ec.id = :company_id", { company_id: filterData.company_id })
      .leftJoin("e.createdBy", "eu")
      .addSelect(["eu.id", "eu.firstName", "eu.lastName"]);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }

  async findAssignesByStudentActivity(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(AssignesMembership)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.studentActivity", "es")
      .leftJoinAndSelect("e.memeberShip", "em")
      .leftJoinAndSelect("e.shared", "esh")
      .leftJoinAndSelect("e.deposites", "esdep")
      .leftJoinAndSelect("e.deskarea", "ed")
      .leftJoinAndSelect("e.assignGeneralOffer", "ess")
      .leftJoinAndSelect("ess.generalOffer", "eg")
      .andWhere("es.id = :studentActivity_id", {
        studentActivity_id: filterData.studentActivity_id,
      })
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"]);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }

  // Update a record
  async update(updateAssignesMembershipDto: UpdateAssignesMembershipDto) {
    const { type, type_user, user_id, status, id, ...rest } = updateAssignesMembershipDto;
    if (status === ReservationStatus.COMPLETE || status === ReservationStatus.CANCELLED) {
      await this.handleValidationIfNeeded(user_id, type, type_user);
    }
    await this.assignesMembershipRepository.update(id, {
      status,
      ...rest,
    });
    return await this.getUpdatedEntity(id);
  }

  async updateEntity(updateAssignesMembershipDto: UpdateAssignesMembershipDto) {
    await this.assignesMembershipRepository.update(
      updateAssignesMembershipDto.id,
      updateAssignesMembershipDto,
    );
    return this.assignesMembershipRepository.findOne({
      where: { id: updateAssignesMembershipDto.id },
      relations: ["deposites"],
    });
  }

  private async handleValidationIfNeeded(user_id: number, type?: string, type_user?: string) {
    if (!type && !type_user) return;

    const validationService = this.getValidationService(type);
    await validationService?.validateCustomerReservation(user_id, type_user);
  }

  private getValidationService(type?: string) {
    return type === "shared" ? this.shared : this.deskarea;
  }

  private async getUpdatedEntity(id: number) {
    return this.assignesMembershipRepository.findOne({
      where: { id },
    });
  }
  async remove(id: number) {
    await this.assignesMembershipRepository.delete(id);
  }

  async calculateCoWrokingSpaceTotalPrice(offerId: number, basePrice: number) {
    let discount = 0;
    const totalPrice = basePrice;

    if (offerId) {
      const offer = await this.offer.findOne(offerId);
      const typeDiscount = offer.type_discount;
      const discountAmount = offer.discount;
      discount = typeDiscount === "amount" ? discountAmount : totalPrice * (discountAmount / 100);
    }
    return totalPrice - discount;
  }
}
