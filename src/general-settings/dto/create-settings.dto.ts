import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";
import { User } from "src/users/user.entity";

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

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  full_day_hours: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  alert_store: number;

  createdBy: User;
}
