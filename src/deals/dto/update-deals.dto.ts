import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateDealsDto } from "./create-deals.dto";

export class UpdateDealsDto extends PartialType(CreateDealsDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
