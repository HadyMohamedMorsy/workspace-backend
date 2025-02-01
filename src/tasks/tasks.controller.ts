import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { EntityName } from "src/shared/decorators/entity-name.decorator";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { EntityIsExistInterceptor } from "src/shared/interceptor/entity-isexist.interceptor";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateTaskDto } from "./dto/create-tasks.dto";
import { UpdateTaskDto } from "./dto/update-tasks.dto";
import { TaskService } from "./tasks.service";

@UseGuards(AuthorizationGuard)
@Controller("task")
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Task,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.taskService.findAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Task,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.taskService.create(createTaskDto);
  }

  @Post("/update")
  @EntityName("task")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.Task,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateTaskDto: UpdateTaskDto) {
    return await this.taskService.update(updateTaskDto);
  }

  @Delete("/delete")
  @EntityName("task")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.Task,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.taskService.remove(bodyDelete.id);
  }
}
