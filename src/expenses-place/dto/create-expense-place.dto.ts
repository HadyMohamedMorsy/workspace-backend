import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateExpensePlaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  cost: number;
}
