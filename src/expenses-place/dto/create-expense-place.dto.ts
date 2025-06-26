import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";
import { Lookup } from "src/lookups/lookup.entity";
import { User } from "src/users/user.entity";

export class CreateExpensePlaceDto {
  expensePlace: Lookup;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  total: number;

  createdBy: User;
}
