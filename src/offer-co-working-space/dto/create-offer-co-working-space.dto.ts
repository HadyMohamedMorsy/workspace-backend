import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { TypeMember } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";

export class CreateCoWorkingSpaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  days: number;

  @IsEnum(TypeMember)
  type: TypeMember;

  createdBy?: User;
}
