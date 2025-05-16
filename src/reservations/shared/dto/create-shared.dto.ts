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
import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { Deposite } from "src/deposit/deposites.entity";
import { ReservationStatus, TimeOfDay } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";

export class CreateSharedDto {
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

  @IsString()
  @IsOptional()
  note: string;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status: ReservationStatus = ReservationStatus.ACTIVE;

  assignGeneralOffer: AssignGeneralOffer;

  createdBy: User;

  deposites?: Deposite;
}
