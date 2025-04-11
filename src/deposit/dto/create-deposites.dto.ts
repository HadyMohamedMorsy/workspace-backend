import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Deals } from "src/deals/deals.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { DepositeStatus, PaymentMethod } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";

export class CreateDepositeDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  entity_id: number;

  @IsEnum(DepositeStatus)
  @IsOptional()
  status: DepositeStatus = DepositeStatus.COMPLETE;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  total_price: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  payment_method?: PaymentMethod;

  createdBy?: User;
  assignMembership?: AssignesMembership;
  assignPackage?: AssignesPackages;
  reservationRoom?: ReservationRoom;
  deal?: Deals;
}
