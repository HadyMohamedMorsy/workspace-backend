import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";

export class CreateReturnsDto {
  @IsString()
  @IsNotEmpty()
  type_store: string;

  @ValidateIf(obj => obj.type_store === "weight")
  @IsNumber()
  @IsNotEmpty()
  weight_kg: number;

  @ValidateIf(obj => obj.type_store === "weight")
  @IsNumber()
  weight_g: number;

  @ValidateIf(obj => obj.type_store === "weight")
  @IsNumber()
  weight_product: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  return_price: number;

  @IsNumber()
  @Type(() => Number)
  product_id: number;

  @IsNumber()
  @Type(() => Number)
  total: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  return_qty: number;
}
