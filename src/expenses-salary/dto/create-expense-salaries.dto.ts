import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";
import { TypeSallary } from "src/shared/enum/global-enum";

export class CreateExpenseSalariesDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  cost: number;

  @IsEnum(TypeSallary, {
    message: "type_sallary must be one of the following Internal or External",
  })
  type_sallary: TypeSallary;

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
}
