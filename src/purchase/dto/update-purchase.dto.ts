import { PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { CreatePurchaseDto } from "./create-purchase.dto";

export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
