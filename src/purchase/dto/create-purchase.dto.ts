import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "src/users/user.entity";

export class CreatePurchaseDto {
  @IsNotEmpty()
  @IsString()
  type_store: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  purshase_price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight_kg?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight_g?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  weight_product?: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  purshase_qty: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  total: number;

  @IsOptional()
  @IsString()
  note?: string;

  createdBy?: User;
}
