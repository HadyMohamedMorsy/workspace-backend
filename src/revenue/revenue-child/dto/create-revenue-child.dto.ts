import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Revenue } from "src/revenue/revenue.entity";
import { User } from "src/users/user.entity";

export class CreateRevenueChildDto {
  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsNumber()
  @Type(() => Number)
  revenueChild_id: number;

  @IsString()
  @IsOptional()
  note: string;

  revenue: Revenue;

  createdBy: User;
}
