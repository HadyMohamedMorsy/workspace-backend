import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
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
  @IsNotEmpty()
  featured_image: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  store: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  selling_price: number;

  @IsArray()
  @Type(() => Number)
  @IsOptional()
  category_ids: number[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Categories)
  categories: Categories[];
}

class Categories {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  label: number;

  @IsString()
  @IsNotEmpty()
  value: number;
}
