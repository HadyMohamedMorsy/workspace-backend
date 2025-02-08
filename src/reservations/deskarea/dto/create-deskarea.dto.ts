import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";
import { TimeOfDay, TypeUser } from "src/shared/enum/global-enum";
import { IsStartBeforeEndValidator } from "src/shared/validations/is-start-hour-validation";

export class CreateDeskAreaDto {
  @IsString()
  @IsNotEmpty()
  selected_day: string;

  @IsString()
  @IsNotEmpty()
  start_hour: string;

  @IsString()
  @IsNotEmpty()
  start_minute: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TimeOfDay)
  start_time: TimeOfDay;

  @IsString()
  @IsNotEmpty()
  end_hour: string;

  @IsString()
  @IsNotEmpty()
  end_minute: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TimeOfDay)
  end_time: TimeOfDay;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  customer_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  reservation_price: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  total: number;

  @IsEnum(TypeUser, {
    message:
      "type order must be one of the following: individual or company or studentActivity or User",
  })
  type_user: TypeUser;

  @IsString()
  @IsNotEmpty()
  note: string;

  @Validate(IsStartBeforeEndValidator)
  validate_time: boolean;
}
