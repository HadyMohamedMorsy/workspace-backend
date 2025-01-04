import { Body, Controller, Delete, HttpCode, Post } from "@nestjs/common";
import { CreateStudentActivityDto } from "./dto/create-StudentActivity.dto";
import { UpdateStudentActivityDto } from "./dto/update-StudentActivity.dto";
import { StudentActivityService } from "./studentActivity.service";
import { Permissions } from "src/auth/decorators/permissions.decorator";
import { Permission } from "src/users/enum/permissions-enum";
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
  async findAll(@Body() filterQueryDto: any) {
    return this.studentActivityService.findAll(filterQueryDto);
  }

  @Post("/store")
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
