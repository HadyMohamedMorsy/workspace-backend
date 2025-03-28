import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";

export class CreatePurchasDto {
  @IsString()
  @IsNotEmpty()
  type_store: string;

  @ValidateIf(obj => obj.type_store === "weight")
  @Transform(({ value }) => {
    if (typeof value === "string") {
      return parseFloat(value.startsWith(".") ? `0${value}` : value);
    }
    return value;
  })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsNotEmpty()
  weight_kg: number;

  @ValidateIf(obj => obj.type_store === "weight")
  @Type(() => Number)
  @IsNumber()
  weight_g: number;

  @ValidateIf(obj => obj.type_store === "weight")
  @Type(() => Number)
  @IsNumber()
  weight_product: number;

  @ValidateIf(obj => obj.individual_type === "item")
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  purshase_price: number;

  @IsNumber()
  @Type(() => Number)
  product_id: number;

  @IsNumber()
  @Type(() => Number)
  total: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  purshase_qty: number;
}
