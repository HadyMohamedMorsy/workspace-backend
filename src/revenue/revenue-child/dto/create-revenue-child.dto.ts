import { Type } from "class-transformer";
import { IsNumber } from "class-validator";
import { Revenue } from "src/revenue/revenue.entity";
import { User } from "src/users/user.entity";

export class CreateRevenueChildDto {
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsNumber()
  @Type(() => Number)
  revenueChild_id: number;

  revenue: Revenue;

  createdBy: User;
}
