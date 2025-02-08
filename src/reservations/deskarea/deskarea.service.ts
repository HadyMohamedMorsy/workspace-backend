import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { Deskarea } from "./deskarea.entity"; // Changed from Company to Deskarea
import { CreateDeskAreaDto } from "./dto/create-deskarea.dto";
import { UpdateDeskAreaDto } from "./dto/update-returns.dto";

@Injectable()
export class DeskareaService {
  constructor(
    @InjectRepository(Deskarea)
    private deskareaRepository: Repository<Deskarea>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  async create(
    createDeskareaDto: CreateDeskAreaDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ) {
    const { customer_id, type_user } = createDeskareaDto;
    const isReservation = await this.findActiveOrInactiveReservationsForCustomer(
      customer_id,
      type_user,
    );
    if (isReservation && isReservation.length) {
      throw new BadRequestException(`u can't reservation again for this user`);
    }

    const deskarea = this.deskareaRepository.create({
      ...createDeskareaDto,
      createdBy: reqBody.createdBy,
      [type_user.toLowerCase()]: reqBody.customer,
    });
    return await this.deskareaRepository.save(deskarea);
  }

  // Get all deskareas
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deskarea).buildQuery(filterData);

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

    const existingReservations = await this.deskareaRepository.find({
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
  // Get deskarea by ID
  async findOne(id: number): Promise<Deskarea> {
    const deskarea = await this.deskareaRepository.findOne({ where: { id } });
    if (!deskarea) {
      throw new NotFoundException(`${deskarea} with id ${id} not found`);
    }
    return deskarea;
  }

  async findDeskareaByIndividualAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deskarea).buildQuery(filterData);
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
  async findDeskareaByComapnyAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deskarea).buildQuery(filterData);
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
  async findDeskareaByStudentActivityAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deskarea).buildQuery(filterData);
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
  async findDeskareaByUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Deskarea).buildQuery(filterData);
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

  async update(updateDeskareaDto: UpdateDeskAreaDto) {
    await this.deskareaRepository.update(updateDeskareaDto.id, updateDeskareaDto);
    return this.deskareaRepository.findOne({ where: { id: updateDeskareaDto.id } });
  }

  async remove(deskareaId: number) {
    await this.deskareaRepository.delete(deskareaId);
  }
}
