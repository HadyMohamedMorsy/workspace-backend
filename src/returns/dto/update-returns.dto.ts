import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateReturnsDto } from "./create-returns.dto";

export class UpdateReturnsDto extends PartialType(CreateReturnsDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
