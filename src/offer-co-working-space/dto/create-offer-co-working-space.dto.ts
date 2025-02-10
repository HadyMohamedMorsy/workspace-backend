import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { TypeMember } from "src/shared/enum/global-enum";
import { Column } from "typeorm";

export enum DiscountType {
  PERCENTAGE = "percentage",
  AMOUNT = "amount",
}

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

  @Column({ type: "enum", enum: TypeMember })
  type: TypeMember;
}
