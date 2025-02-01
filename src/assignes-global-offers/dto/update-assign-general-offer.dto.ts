import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateAssignGeneralOfferDto } from "./create-assign-general-offer.dto";

export class UpdateAssignGeneralOfferDto extends PartialType(CreateAssignGeneralOfferDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
