import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ReservationStatus, TimeOfDay, TypeUser } from "src/shared/enum/global-enum";

export class CreateSharedDto {
  @IsString()
  @IsNotEmpty()
  selected_day: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  start_hour: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  start_minute: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TimeOfDay)
  start_time: TimeOfDay;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  customer_id: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offer_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  setting_id: number;

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
