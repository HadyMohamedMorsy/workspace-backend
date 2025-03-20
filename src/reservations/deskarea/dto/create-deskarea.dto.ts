import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from "class-validator";
import { ReservationStatus, TimeOfDay, TypeUser } from "src/shared/enum/global-enum";

export class CreateDeskAreaDto {
  @IsString()
  @IsNotEmpty()
  selected_day: string;

  @IsBoolean()
  is_full_day: boolean;

  @ValidateIf(obj => !obj.is_full_day)
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  start_hour: number;

  @ValidateIf(obj => !obj.is_full_day)
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  start_minute: number;

  @ValidateIf(obj => !obj.is_full_day)
  @IsString()
  @IsNotEmpty()
  @IsEnum(TimeOfDay)
  start_time: TimeOfDay;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  customer_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  setting_id: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offer_id: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  membership_id: number;

  @IsEnum(TypeUser, {
    message:
      "type order must be one of the following: individual or company or studentActivity or User",
  })
  type_user: TypeUser;

  @IsString()
  @IsOptional()
  note: string;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status: ReservationStatus = ReservationStatus.ACTIVE;
}
