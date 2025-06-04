import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ExpensePlace } from "src/expenses-place/expense-place.entity";
import { User } from "src/users/user.entity";

export class CreateExpensePlaceChildDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  cost: number;

  @IsString()
  @IsOptional()
  featured_image: string;

  @IsNumber()
  @Type(() => Number)
  expensePlace_id: number;

  createdBy: User;

  expensePlace: ExpensePlace;
}
