import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateExpensePlaceChildDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  cost: number;

  @IsString()
  @IsOptional()
  featured_image: string;

  @IsNumber()
  @Type(() => Number)
  expensePlace_id: number;
}
