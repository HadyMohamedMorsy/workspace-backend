import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { TypeOrder, TypeUser } from "../enum/type.enum";

export class CreateOrderDto {
  @IsEnum(TypeOrder, {
    message: "type order must be one of the following: hold or paid",
  })
  type_order: TypeOrder;

  @IsEnum(TypeUser, {
    message:
      "type order must be one of the following: individual or company or studentActivity or User",
  })
  type_user: TypeUser;

  @IsString()
  @IsNotEmpty()
  order_number: string;

  @ValidateIf(obj => obj.type_user === "employed")
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  user_id: number;

  @ValidateIf(obj => obj.type_user === "individual")
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  individual_id: number;

  @ValidateIf(obj => obj.type_user === "company")
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  company_id: number;

  @ValidateIf(obj => obj.type_user === "studentActivity")
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  studentActivity_id: number;

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
