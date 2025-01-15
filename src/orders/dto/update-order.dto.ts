import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateOrderDto } from "./create-order.dto";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
