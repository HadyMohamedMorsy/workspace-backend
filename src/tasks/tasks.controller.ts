import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateTaskDto } from "./dto/create-tasks.dto";
import { UpdateTaskDto } from "./dto/update-tasks.dto";
import { TaskService } from "./tasks.service";

@UseGuards(AuthorizationGuard)
@Controller("task")
export class TaskController implements SelectOptions, RelationOptions {
  constructor(private readonly service: TaskService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      name: true,
      note: true,
      status: true,
      created_at: true,
      updated_at: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      user: {
        id: true,
        firstName: true,
        lastName: true,
      },
      createdBy: {
        id: true,
        firstName: true,
        lastName: true,
      },
    };
  }

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Task,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Task,
      actions: [Permission.INDEX],
    },
  ])
  async findByUserAll(@Body() filterQueryDto: any) {
    return this.service.findUserAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Task,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    return await this.service.create(
      {
        name: createTaskDto.name,
        note: createTaskDto.note,
        user: req["assignToUser"],
        createdBy: req["createdBy"],
      } as CreateTaskDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Task,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateTaskDto: UpdateTaskDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: updateTaskDto.id,
        name: updateTaskDto.name,
        note: updateTaskDto.note,
        user: req["assignToUser"],
        createdBy: req["createdBy"],
      } as UpdateTaskDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Task,
      actions: [Permission.DELETE],
    },
  ])
  public delete(@Body() id: number) {
    return this.service.delete(id);
  }

  @Patch("/change-status")
  @Permissions([
    {
      resource: Resource.Task,
      actions: [Permission.UPDATE],
    },
  ])
  public changeStatus(@Body() update: { id: number; status: boolean }) {
    return this.service.changeStatus(update.id, update.status, "status", {
      id: true,
      status: true,
    });
  }
}
