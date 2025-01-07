import { Body, Controller, Delete, HttpCode, Post, UseInterceptors } from "@nestjs/common";
import { Permissions } from "src/auth/decorators/permissions.decorator";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permission } from "src/users/enum/permissions-enum";
import { CreateStudentActivityDto } from "./dto/create-StudentActivity.dto";
import { UpdateStudentActivityDto } from "./dto/update-StudentActivity.dto";
import { StudentActivityService } from "./studentActivity.service";
@Controller("studentActivity")
export class StudentActivityController {
  constructor(private readonly studentActivityService: StudentActivityService) {}

  @Post("/index")
  @Permissions([
    {
      resource: "studentActivity",
      actions: [Permission.INDEX],
    },
  ])
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  async findAll(@Body() filterQueryDto: any) {
    return this.studentActivityService.findAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: "studentActivity",
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createProductDto: CreateStudentActivityDto) {
    return await this.studentActivityService.create(createProductDto);
  }

  @Post("/update")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: "studentActivity",
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateProductDto: UpdateStudentActivityDto) {
    return await this.studentActivityService.update(updateProductDto);
  }

  @Delete("/delete")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: "studentActivity",
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.studentActivityService.remove(bodyDelete.id);
  }
}
