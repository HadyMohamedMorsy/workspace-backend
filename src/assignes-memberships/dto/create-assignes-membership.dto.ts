import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ReservationStatus, TypeUser } from "src/shared/enum/global-enum";
import { IsDateBefore } from "src/shared/validations/is-date-before.validation";

export class CreateAssignesMembershipDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  customer_id: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  membership_id: number;

  @IsString()
  @IsNotEmpty()
  @IsDateBefore("end_date")
  start_date: string;

  @IsString()
  @IsNotEmpty()
  end_date: string;

  @IsEnum(TypeUser, {
    message:
      "type order must be one of the following: individual or company or studentActivity or User",
  })
  type_user: TypeUser;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  total_price: number;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status: ReservationStatus = ReservationStatus.ACTIVE;
}
