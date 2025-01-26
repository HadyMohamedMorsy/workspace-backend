import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateCoWorkingSpaceDto } from "./create-offer-co-working-space.dto";

export class UpdateCoWorkingSpaceDto extends PartialType(CreateCoWorkingSpaceDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
