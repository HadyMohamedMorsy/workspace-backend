import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateGeneralOfferDto } from "./create-general-offer.dto";

export class UpdateGeneralOfferDto extends PartialType(CreateGeneralOfferDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
