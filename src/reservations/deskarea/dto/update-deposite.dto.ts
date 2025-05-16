import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { Deposite } from "src/deposit/deposites.entity";

export class UpdateDepositeDto {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;

  deposites: Deposite;
}
