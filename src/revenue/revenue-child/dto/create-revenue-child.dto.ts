import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Lookup } from "src/lookups/lookup.entity";
import { Revenue } from "src/revenue/revenue.entity";
import { PaymentMethod } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";

export class CreateRevenueChildDto {
  @IsNumber()
  @Type(() => Number)
  amount: number;

  revenue_child: Lookup;

  @IsEnum(PaymentMethod)
  @IsOptional()
  payment_method: PaymentMethod;

  @IsString()
  @IsOptional()
  note: string;

  revenue: Revenue;

  createdBy: User;
}
