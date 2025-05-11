import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { User } from "src/users/user.entity";

export class CreatePurchaseDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type_store: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  purchase_price?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  weight_kg?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  weight_g?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  weight_product?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  purchase_qty: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  total: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note?: string;

  createdBy?: User;
}
