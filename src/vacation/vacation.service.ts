import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm"; // Change to update-task.dto
import { CreateVacationDto } from "./dto/create-vacation.dto";
import { UpdateVacationDto } from "./dto/update-vacation.dto";
import { Vacation } from "./vacation.entity";

@Injectable()
export class VacationService {
  // Change service name to TaskService
  constructor(
    @InjectRepository(Vacation)
    private vacationRepository: Repository<Vacation>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  async create(create: CreateVacationDto) {
    const vacation = this.vacationRepository.create(create);
    const newVacation = await this.vacationRepository.save(vacation);
    return this.vacationRepository.findOne({
      where: { id: newVacation.id },
      relations: ["user"],
    });
  }

  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Vacation).buildQuery(filterData);

    queryBuilder
      .leftJoin("e.user", "eu")
      .leftJoin("e.createdBy", "ec")
      .addSelect(["eu.id", "eu.firstName", "eu.lastName"])
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

  async findUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Vacation).buildQuery(filterData);

    queryBuilder
      .leftJoin("e.user", "ec")
      .leftJoin("e.createdBy", "eu")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"])
      .addSelect(["eu.id", "eu.firstName", "eu.lastName"])
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

  async findOne(id: number): Promise<Vacation> {
    const task = await this.vacationRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  async update(updateTaskDto: UpdateVacationDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_id, ...payload } = updateTaskDto;
    await this.vacationRepository.update(updateTaskDto.id, payload);
    return this.vacationRepository.findOne({
      where: { id: updateTaskDto.id },
      relations: ["user"],
    });
  }

  // Delete a task
  async remove(id: number) {
    await this.vacationRepository.delete(id);
  }
}
