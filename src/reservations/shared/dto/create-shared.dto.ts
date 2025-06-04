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
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { Company } from "src/companies/company.entity";
import { Deposite } from "src/deposit/deposites.entity";
import { Individual } from "src/individual/individual.entity";
import { ReservationStatus, TimeOfDay } from "src/shared/enum/global-enum";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
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

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  total_price: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  end_hour: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  end_minute: number;

  @IsString()
  @IsOptional()
  @IsEnum(TimeOfDay)
  end_time: TimeOfDay;

  @IsNumber()
  @IsOptional()
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

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  total_time: number;

  createdBy: User;
  assignGeneralOffer: AssignGeneralOffer;
  deposites?: Deposite;
  individual: Individual;
  company: Company;
  assignessMemebership: AssignesMembership;
  studentActivity: StudentActivity;
}
