import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { CreateReservationRoomDto } from "./dto/create-reservation-rooms.dto";
import { UpdateReservationRoomDto } from "./dto/update-reservation-rooms.dto";
import { ReservationRoom } from "./reservation-room.entity";

@Injectable()
export class ReservationRoomService {
  constructor(
    @InjectRepository(ReservationRoom)
    private reservationRoomRepository: Repository<ReservationRoom>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  async create(
    createReservationRoomDto: CreateReservationRoomDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ) {
    const { customer_id, type_user } = createReservationRoomDto;
    const isReservation = await this.findActiveOrInactiveReservationsForCustomer(
      customer_id,
      type_user,
    );
    if (isReservation && isReservation.length) {
      throw new BadRequestException(`u can't reservation again for this user`);
    }
    const reservationRoom = this.reservationRoomRepository.create({
      ...createReservationRoomDto,
      createdBy: reqBody.createdBy,
      [type_user.toLowerCase()]: reqBody.customer,
    });
    return await this.reservationRoomRepository.save(reservationRoom);
  }

  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

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

    const existingReservations = await this.reservationRoomRepository.find({
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

  async findRoomsByIndividualAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

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
  async findRoomsByComapnyAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.company", "ec")
      .leftJoinAndSelect("e.room", "er")
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
  async findRoomsByStudentActivityAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

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

  async findRoomsByUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(ReservationRoom)
      .buildQuery(filterData);

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

  async findOne(id: number): Promise<ReservationRoom> {
    const reservationRoom = await this.reservationRoomRepository.findOne({ where: { id } });
    if (!reservationRoom) {
      throw new NotFoundException(`${reservationRoom} with id ${id} not found`);
    }
    return reservationRoom;
  }

  async update(updateReservationRoomDto: UpdateReservationRoomDto) {
    await this.reservationRoomRepository.update(
      updateReservationRoomDto.id,
      updateReservationRoomDto,
    );
    return this.reservationRoomRepository.findOne({ where: { id: updateReservationRoomDto.id } });
  }

  async remove(reservationRoomId: number) {
    await this.reservationRoomRepository.delete(reservationRoomId);
  }
}
