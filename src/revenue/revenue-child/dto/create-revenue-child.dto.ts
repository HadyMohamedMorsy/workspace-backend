import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Revenue } from "src/revenue/revenue.entity";
import { PaymentMethod } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";

export class CreateRevenueChildDto {
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @Type(() => Number)
  revenueChild_id: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  payment_method: PaymentMethod;

  @IsString()
  @IsOptional()
  note: string;

  revenue: Revenue;

  createdBy: User;
}
