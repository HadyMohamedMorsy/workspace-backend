import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Deposite } from "src/deposit/deposites.entity";
import { ReservationStatus, TypeUser } from "src/shared/enum/global-enum";
import { IsAfter } from "src/shared/validations/validate-time-reservation.validation";

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

  @IsEnum(TypeUser, {
    message:
      "type order must be one of the following: individual or company or studentActivity or User",
  })
  type_user: TypeUser;

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

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  user_id?: number;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status: ReservationStatus = ReservationStatus.ACTIVE;

  @IsOptional()
  deposites?: Deposite;
}
