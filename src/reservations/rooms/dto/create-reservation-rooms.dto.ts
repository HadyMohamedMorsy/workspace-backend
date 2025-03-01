import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ReservationStatus, TimeOfDay, TypeUser } from "src/shared/enum/global-enum";

export class CreateReservationRoomDto {
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
  @Type(() => Number)
  @IsNotEmpty()
  end_hour: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  end_minute: number;

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
  room_id: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offer_id: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deal_id: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  package_id: number;

  @IsEnum(TypeUser, {
    message:
      "type order must be one of the following: individual or company or studentActivity or User",
  })
  type_user: TypeUser;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price: number;

  @IsString()
  @IsOptional()
  note: string;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status: ReservationStatus = ReservationStatus.ACTIVE;
}
