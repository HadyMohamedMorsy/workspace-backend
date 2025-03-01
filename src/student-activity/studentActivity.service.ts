import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateStudentActivityDto } from "./dto/create-StudentActivity.dto";
import { UpdateStudentActivityDto } from "./dto/update-StudentActivity.dto";
import { StudentActivity } from "./StudentActivity.entity";

@Injectable()
export class StudentActivityService {
  constructor(
    @InjectRepository(StudentActivity)
    private studentActivityRepository: Repository<StudentActivity>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  // Create a new record
  async create(createStudentActivityDto: CreateStudentActivityDto): Promise<StudentActivity> {
    const studentActivity = this.studentActivityRepository.create(createStudentActivityDto);
    if (studentActivity) {
      const newClient = await this.studentActivityRepository.save(studentActivity);
      return await this.findOne(newClient.id);
    }
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(StudentActivity)
      .buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.assign_memberships", "ep", "ep.status = :status_memeber", {
        status_memeber: ReservationStatus.ACTIVE,
      })
      .leftJoinAndSelect("ep.memeberShip", "ms")
      .leftJoinAndSelect("e.assignesPackages", "es", "es.status = :status_package", {
        status_package: ReservationStatus.ACTIVE,
      })
      .leftJoinAndSelect("es.packages", "pa")
      .leftJoinAndSelect("pa.room", "pr")
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"])
      .leftJoinAndSelect("e.orders", "eo", "eo.type_order = :typeOrder", {
        typeOrder: "HOLD",
      });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }

  async findByUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(StudentActivity)
      .buildQuery(filterData);

    queryBuilder
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

  // Get record by ID
  async findOne(id: number): Promise<StudentActivity> {
    const studentActivity = await this.studentActivityRepository.findOne({
      where: { id },
      relations: ["assignGeneralOffers", "assign_memberships", "assignesPackages", "createdBy"],
    });
    if (!studentActivity) {
      throw new NotFoundException(`${studentActivity} with id ${id} not found`);
    }
    return studentActivity;
  }

  // Update a record
  async update(updateStudentActivityDto: UpdateStudentActivityDto) {
    await this.studentActivityRepository.update(
      updateStudentActivityDto.id,
      updateStudentActivityDto,
    );
    return this.studentActivityRepository.findOne({ where: { id: updateStudentActivityDto.id } });
  }

  // Delete a record
  async remove(studentActivityId: number) {
    await this.studentActivityRepository.delete(studentActivityId);
  }
}
