import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateDepositeDto } from "./create-deposites.dto";

export class UpdateDepositeDto extends PartialType(CreateDepositeDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
