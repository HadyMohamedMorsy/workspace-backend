import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ExpensePlace } from "src/expenses-place/expense-place.entity";
import { PaymentMethod } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";

export class CreateExpensePlaceChildDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  cost: number;

  @IsString()
  @IsOptional()
  featured_image: string;

  @IsEnum(PaymentMethod)
  @IsOptional()
  payment_method: PaymentMethod;

  @IsString()
  @IsOptional()
  note: string;

  @IsNumber()
  @Type(() => Number)
  expensePlace_id: number;

  createdBy: User;

  expensePlace: ExpensePlace;
}
