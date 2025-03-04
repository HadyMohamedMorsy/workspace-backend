import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
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

  @Post("/user")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Task,
      actions: [Permission.INDEX],
    },
  ])
  async findByUserAll(@Body() filterQueryDto: any) {
    return this.taskService.findUserAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Task,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    const user = req["assignToUser"];
    const createdBy = req["createdBy"];
    const payload = { ...createTaskDto, user, createdBy };
    return await this.taskService.create(payload);
  }

  @Post("/update")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Task,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateTaskDto: UpdateTaskDto, @Req() req: Request) {
    const user = req["user"];
    const createdBy = req["createdBy"];
    const payload = { ...updateTaskDto, user, createdBy };
    return await this.taskService.update(payload);
  }

  @Delete("/delete")
  @UseInterceptors(DeleteCacheInterceptor)
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
