import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateVacationDto } from "./create-vacation.dto";

export class UpdateVacationDto extends PartialType(CreateVacationDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
