import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ReservationStatus, TypeUser } from "src/shared/enum/global-enum";

export class CreateAssignGeneralOfferDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  customer_id: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  offer_id: number;

  @IsEnum(TypeUser, {
    message:
      "type order must be one of the following: individual or company or studentActivity or User",
  })
  type_user: TypeUser;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status: ReservationStatus = ReservationStatus.ACTIVE;
}
