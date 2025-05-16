import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { TypeOrder } from "src/shared/enum/global-enum";

export class CreateOrderDto {
  @IsEnum(TypeOrder, {
    message: "type order must be one of the following: hold or paid",
  })
  type_order: TypeOrder;

  @IsString()
  @IsNotEmpty()
  order_number: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  customer_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsOptional()
  order_items: OrderItemDto[];
}

export class OrderItemDto {
  product: any;

  @IsNumber()
  @Type(() => Number)
  quantity: number;
}
