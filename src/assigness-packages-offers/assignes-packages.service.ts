import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { OfferPackagesService } from "src/offer-packages/offerpackages.service";
import { ReservationRoomService } from "src/reservations/rooms/reservation-room.service";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { AssignesPackages } from "./assignes-packages.entity";
import { CreateAssignesPackageDto } from "./dto/create-assignes-packages.dto";
import { UpdateAssignesPackageDto } from "./dto/update-assignes-packages.dto";

@Injectable()
export class AssignesPackagesService {
  constructor(
    @InjectRepository(AssignesPackages)
    private assignesPackagesRepository: Repository<AssignesPackages>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly offerPackagesService: OfferPackagesService,
    @Inject(forwardRef(() => ReservationRoomService))
    private readonly reservationRoom: ReservationRoomService,
  ) {}

  // Create a new record
  async create(
    create: CreateAssignesPackageDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ): Promise<AssignesPackages> {
    const packages = await this.offerPackagesService.findOne(create.package_id);
    if (!packages) {
      throw new NotFoundException(`packages with  not found`);
    }

    const assignes_packages = this.assignesPackagesRepository.create({
      ...create,
      total_used: +packages.hours,
      used: 0,
      remaining: +packages.hours,
      createdBy: reqBody.createdBy,
      [create.type_user.toLowerCase()]: reqBody.customer,
      packages,
    });
    const newPackage = await this.assignesPackagesRepository.save(assignes_packages);
    return this.findOne(newPackage.id);
  }

  // Get a single record by ID
  async findOne(id: number): Promise<AssignesPackages> {
    const assignes_packages = await this.assignesPackagesRepository.findOne({
      where: { id },
      relations: ["packages"],
    });
    if (!assignes_packages) {
      throw new NotFoundException(`assignes_packages with id ${id} not found`);
    }
    return assignes_packages;
  }

  async findAssignesByUser(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(AssignesPackages)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.packages", "ep")
      .leftJoinAndSelect("e.packages", "ep")
      .leftJoinAndSelect("ep.room", "epr")
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
      .setRepository(AssignesPackages)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
      .leftJoinAndSelect("e.packages", "ep")
      .leftJoinAndSelect("ep.room", "epr")
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
      .setRepository(AssignesPackages)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
      .leftJoinAndSelect("e.packages", "ep")
      .leftJoinAndSelect("ep.room", "epr")
      .andWhere("ec.id = :company_id", { company_id: filterData.company_id })
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
  async findAssignesByStudentActivity(filterData: any) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(AssignesPackages)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
      .leftJoinAndSelect("e.packages", "ep")
      .leftJoinAndSelect("ep.room", "epr")
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
  async update(updateassignesPackagesDto: UpdateAssignesPackageDto) {
    const { status, user_id, type_user } = updateassignesPackagesDto;
    await this.handleStatusValidation(status, user_id, type_user);
    return this.assignesPackagesRepository.update(updateassignesPackagesDto.id, { status });
  }

  private async handleStatusValidation(
    status: ReservationStatus,
    userId?: number,
    typeUser?: string,
  ) {
    if (status === ReservationStatus.COMPLETE && userId) {
      await this.reservationRoom.findActiveOrInactiveReservationsForCustomer(userId, typeUser);
    }
  }

  private async fetchUpdatedPackage(id: number) {
    return this.assignesPackagesRepository.findOne({
      where: { id },
    });
  }

  // Delete a record
  async remove(id: number) {
    await this.assignesPackagesRepository.delete(id);
  }
}
