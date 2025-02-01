import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateGeneralSettingsDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  shift_start: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  shift_end: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price_shared: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price_deskarea: number;
}
