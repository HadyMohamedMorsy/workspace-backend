import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, MaxLength, Min, MinLength } from "class-validator";

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

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  selling_price: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  purchase_price: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  store: number;
}
