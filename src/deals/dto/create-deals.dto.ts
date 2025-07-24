import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { Company } from "src/companies/company.entity";
import { GeneralOffer } from "src/general-offer/generalOffer.entity";
import { Individual } from "src/individual/individual.entity";
import { Room } from "src/rooms/room.entity";
import { PaymentMethod, ReservationStatus } from "src/shared/enum/global-enum";
import { IsAfter } from "src/shared/validations/validate-time-reservation.validation";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";

export class CreateDealsDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  room_id: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  offer_id?: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  user_id?: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  hours: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  payment_method: PaymentMethod;

  @IsString()
  @IsNotEmpty()
  start_date: string;

  @IsString()
  @IsNotEmpty()
  @IsAfter("start_date")
  end_date: string;

  @IsOptional()
  @Type(() => Number)
  start_deposite?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  total_price: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price_hour: number;

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
  customer_id: number;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status: ReservationStatus = ReservationStatus.ACTIVE;

  room?: Room;

  offer?: GeneralOffer;

  customer?: Individual | Company | StudentActivity;

  createdBy: User;

  assignGeneralOffer: AssignGeneralOffer;

  individual?: Individual;

  company?: Company;

  studentActivity?: StudentActivity;
}
