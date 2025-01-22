import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
    return await this.studentActivityRepository.save(studentActivity);
  }

  // Get all records
  async findAll(filterData) {
    const filteredRecord = await this.apiFeaturesService
      .setRepository(StudentActivity)
      .getFilteredData(filterData);
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<StudentActivity> {
    const studentActivity = await this.studentActivityRepository.findOne({ where: { id } });
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
