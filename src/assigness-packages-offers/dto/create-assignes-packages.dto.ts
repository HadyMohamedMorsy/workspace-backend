import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { OfferPackages } from "src/offer-packages/offer-package.entity";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { IsAfter } from "src/shared/validations/validate-time-reservation.validation";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";

export class CreateAssignesPackageDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  customer_id: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  package_id: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  offer_id?: number;

  @IsString()
  @IsNotEmpty()
  start_date: string;

  @IsString()
  @IsNotEmpty()
  @IsAfter("start_date")
  end_date: string;

  @IsOptional()
  @Type(() => Number)
  used: number;

  @IsOptional()
  @Type(() => Number)
  total_used: number;

  @IsOptional()
  @Type(() => Number)
  remaining: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  total_price: number;

  @IsOptional()
  @Type(() => Number)
  deposites?: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  user_id?: number;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status: ReservationStatus = ReservationStatus.ACTIVE;

  createdBy: User;

  assignGeneralOffer: AssignGeneralOffer;

  packages: OfferPackages;

  individual: Individual;

  company: Company;

  studentActivity: StudentActivity;
}
