import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Company } from "src/companies/company.entity";
import { Deals } from "src/deals/deals.entity";
import { Deposite } from "src/deposit/deposites.entity";
import { Individual } from "src/individual/individual.entity";
import { Room } from "src/rooms/room.entity";
import { PaymentMethod, ReservationStatus, TimeOfDay } from "src/shared/enum/global-enum";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";

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

  deposites?: Deposite;

  deals?: Deals;

  assignesPackages?: AssignesPackages;

  payment_method?: PaymentMethod;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  total_price?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  total_time?: number;

  createdBy: User;

  assignGeneralOffer?: AssignGeneralOffer;
  individual: Individual;
  company: Company;
  studentActivity: StudentActivity;
  room: Room;
}
