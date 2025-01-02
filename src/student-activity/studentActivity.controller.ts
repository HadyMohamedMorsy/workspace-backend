import { Body, Controller, Delete, HttpCode, Post } from "@nestjs/common";
import { CreateStudentActivityDto } from "./dto/create-StudentActivity.dto";
import { UpdateStudentActivityDto } from "./dto/update-StudentActivity.dto";
import { StudentActivityService } from "./studentActivity.service";

@Controller("studentActivity")
export class StudentActivityController {
  constructor(private readonly studentActivityService: StudentActivityService) {}

  @Post("/index")
  @HttpCode(200)
  async findAll(@Body() filterQueryDto: any) {
    return this.studentActivityService.findAll(filterQueryDto);
  }

  @Post("/store")
  async create(@Body() createProductDto: CreateStudentActivityDto) {
    return await this.studentActivityService.create(createProductDto);
  }

  @Post("/update")
  async update(@Body() updateProductDto: UpdateStudentActivityDto) {
    return await this.studentActivityService.update(updateProductDto);
  }

  @Delete("/delete")
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.studentActivityService.remove(bodyDelete.id);
  }
}
