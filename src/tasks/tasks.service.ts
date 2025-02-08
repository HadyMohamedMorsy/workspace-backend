import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm"; // Change to update-task.dto
import { CreateTaskDto } from "./dto/create-tasks.dto";
import { UpdateTaskDto } from "./dto/update-tasks.dto";
import { Task } from "./tasks.entity"; // Change to Task entity

@Injectable()
export class TaskService {
  // Change service name to TaskService
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  async create(create: CreateTaskDto) {
    const task = this.taskRepository.create(create);
    const newTask = await this.taskRepository.save(task);
    return this.taskRepository.findOne({
      where: { id: newTask.id },
      relations: ["user"],
    });
  }

  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Task).buildQuery(filterData);

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
    const queryBuilder = this.apiFeaturesService.setRepository(Task).buildQuery(filterData);

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

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  async update(updateTaskDto: UpdateTaskDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { user_id, ...payload } = updateTaskDto;
    await this.taskRepository.update(updateTaskDto.id, payload);
    return this.taskRepository.findOne({
      where: { id: updateTaskDto.id },
      relations: ["user"],
    });
  }

  // Delete a task
  async remove(id: number) {
    await this.taskRepository.delete(id);
  }
}
