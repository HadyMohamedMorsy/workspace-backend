import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { TypeUser } from "src/shared/enum/global-enum";

export class CreateAssignGeneralOfferDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  customer_id: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  offer_id: number;

  @IsEnum(TypeUser, {
    message:
      "type order must be one of the following: individual or company or studentActivity or User",
  })
  type_user: TypeUser;
}
