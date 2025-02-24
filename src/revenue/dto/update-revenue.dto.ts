import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateRevenueDto } from "./create-revenue.dto";

export class UpdateRevenueDto extends PartialType(CreateRevenueDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
