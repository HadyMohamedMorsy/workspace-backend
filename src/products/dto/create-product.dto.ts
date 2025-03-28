import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  code: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  @IsString()
  @IsOptional()
  featured_image: string;

  @IsEnum(
    {
      Wieght: "weight",
      Item: "item",
    },
    {
      message: "weight or item only",
    },
  )
  type: "item" | "weight";

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  store: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  selling_price: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  purshase_price: number;

  @IsArray()
  @Type(() => Number)
  category_ids: number[];
}
