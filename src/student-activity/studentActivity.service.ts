import { BadRequestException, Injectable, RequestTimeoutException } from "@nestjs/common";
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
    try {
      const studentActivity = this.studentActivityRepository.create(createStudentActivityDto);
      return await this.studentActivityRepository.save(studentActivity);
    } catch (error) {
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
        {
          description: `Error connecting to the the datbase ${error}`,
        },
      );
    }
  }

  // Get all records
  async findAll(filterData) {
    this.apiFeaturesService.setRepository(StudentActivity);
    const filteredRecord = await this.apiFeaturesService.getFilteredData(filterData);
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<StudentActivity> {
    let studentActivity: StudentActivity | undefined = undefined;

    try {
      studentActivity = await this.studentActivityRepository.findOne({ where: { id } });
    } catch (error) {
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
        {
          description: `Error connecting to the the datbase ${error}`,
        },
      );
    }

    if (!studentActivity) {
      throw new BadRequestException("User does not exists");
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
  async remove(id: number) {
    await this.studentActivityRepository.delete(id);
  }
}
