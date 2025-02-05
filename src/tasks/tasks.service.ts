import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { UserService } from "src/users/user.service";
import { Repository } from "typeorm"; // Change to update-task.dto
import { CreateTaskDto } from "./dto/create-tasks.dto";
import { UpdateTaskDto } from "./dto/update-tasks.dto";
import { Task } from "./tasks.entity"; // Change to Task entity

@Injectable()
export class TaskService {
  // Change service name to TaskService
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>, // Change to Task repository
    protected readonly apiFeaturesService: APIFeaturesService,
    private readonly usersService: UserService,
  ) {}

  // Create a new task
  async create(create: CreateTaskDto): Promise<Task> {
    const user = await this.usersService.findOneById(create.user_id);
    if (!user) {
      throw new NotFoundException(`user is not found `);
    }

    const createdBy = await this.usersService.findOneById(create.created_by);
    if (!user) {
      throw new NotFoundException(`user is not found `);
    }

    const task = this.taskRepository.create({
      ...create,
      user,
      createdBy,
    });
    return await this.taskRepository.save(task);
  }

  // Get all tasks
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Task).buildQuery(filterData);
    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }

  // Find a task by ID
  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  // Update an existing task
  async update(updateTaskDto: UpdateTaskDto) {
    await this.taskRepository.update(updateTaskDto.id, updateTaskDto);
    return this.taskRepository.findOne({ where: { id: updateTaskDto.id } });
  }

  // Delete a task
  async remove(id: number) {
    await this.taskRepository.delete(id);
  }
}
