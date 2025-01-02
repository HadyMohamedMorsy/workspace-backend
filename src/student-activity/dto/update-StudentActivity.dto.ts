import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateStudentActivityDto } from "./create-StudentActivity.dto";

export class UpdateStudentActivityDto extends PartialType(CreateStudentActivityDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
