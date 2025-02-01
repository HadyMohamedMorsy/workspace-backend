import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateTaskDto } from "./create-tasks.dto";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
