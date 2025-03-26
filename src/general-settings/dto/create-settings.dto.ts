import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateGeneralSettingsDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price_shared: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price_deskarea: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  full_day_price_deskarea: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  full_day_price_shared: number;
}
