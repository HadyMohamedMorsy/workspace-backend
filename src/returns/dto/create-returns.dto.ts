import { Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { Product } from "src/products/product.entity";
import { User } from "src/users/user.entity";

export class CreateReturnsDto {
  @IsString()
  @IsNotEmpty()
  type_store: string;

  @IsString()
  @IsOptional()
  note: string;

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
  @IsNumber()
  @Type(() => Number)
  weight_g: number;

  @ValidateIf(obj => obj.type_store === "weight")
  @IsNumber()
  @Type(() => Number)
  weight_product: number;

  @ValidateIf(obj => obj.individual_type === "item")
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

  createdBy: User;

  product: Product;
}
