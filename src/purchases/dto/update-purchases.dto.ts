import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreatePurchasDto } from "./create-purchases.dto";

export class UpdatePurchasDto extends PartialType(CreatePurchasDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
