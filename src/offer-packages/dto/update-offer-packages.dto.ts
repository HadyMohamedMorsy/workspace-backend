import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateOfferPackagesDto } from "./create-offer-packages.dto";

export class UpdateOfferPackagesDto extends PartialType(CreateOfferPackagesDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
