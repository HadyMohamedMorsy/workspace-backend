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
import { EntityName } from "src/shared/decorators/entity-name.decorator";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { EntityIsExistInterceptor } from "src/shared/interceptor/entity-isexist.interceptor";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateStudentActivityDto } from "./dto/create-StudentActivity.dto";
import { UpdateStudentActivityDto } from "./dto/update-StudentActivity.dto";
import { StudentActivityService } from "./studentActivity.service";

@UseGuards(AuthorizationGuard)
@Controller("studentActivity")
export class StudentActivityController {
  constructor(private readonly studentActivityService: StudentActivityService) {}

  @Post("/index")
  @Permissions([
    {
      resource: Resource.StudentActivity,
      actions: [Permission.INDEX],
    },
  ])
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  async findAll(@Body() filterQueryDto: any) {
    return this.studentActivityService.findAll(filterQueryDto);
  }

  @Post("/user")
  @Permissions([
    {
      resource: Resource.StudentActivity,
      actions: [Permission.INDEX],
    },
  ])
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  async findByUserAll(@Body() filterQueryDto: any) {
    return this.studentActivityService.findByUserAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.StudentActivity,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createStudentDto: CreateStudentActivityDto, @Req() req: Request) {
    const payload = { ...createStudentDto, createdBy: req["createdBy"] };
    return await this.studentActivityService.create(payload);
  }

  @Post("/update")
  @EntityName("studentActivity")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.StudentActivity,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateStudentDto: UpdateStudentActivityDto, @Req() req: Request) {
    const payload = { ...updateStudentDto, createdBy: req["createdBy"] };
    return await this.studentActivityService.update(payload);
  }

  @Delete("/delete")
  @EntityName("studentActivity")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.StudentActivity,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.studentActivityService.remove(bodyDelete.id);
  }
}
