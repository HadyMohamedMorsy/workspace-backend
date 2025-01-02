import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateIndividualDto } from "./create-individual.dto";

export class UpdateIndividualDto extends PartialType(CreateIndividualDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
