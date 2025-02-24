import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateRevenueChildDto } from "./create-revenue-child.dto";

export class UpdateRevenueChildDto extends PartialType(CreateRevenueChildDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
