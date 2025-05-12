import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { TypeSallary } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";

export class CreateExpenseSalariesDto {
  @IsEnum(TypeSallary, {
    message: "type_sallary must be one of the following Internal or External",
  })
  type_sallary: TypeSallary;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  sallary: number;

  @ValidateIf(obj => obj.type === TypeSallary.Internal)
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  incentives: number;

  @ValidateIf(obj => obj.type === TypeSallary.Internal)
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  rewards: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  net_sallary: number;

  @ValidateIf(obj => obj.type === TypeSallary.Internal)
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  annual: number;

  @ValidateIf(obj => obj.type === TypeSallary.Internal)
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  discounts: number;

  @ValidateIf(obj => obj.type === TypeSallary.Internal)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateIf(obj => obj.type === TypeSallary.Internal)
  @IsString()
  @IsNotEmpty()
  destination: string;

  @ValidateIf(obj => obj.type === TypeSallary.Internal)
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  user_id: number;

  createdBy: User;

  user: User;
}
