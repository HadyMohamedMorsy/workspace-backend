import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  total: number;

  @IsString()
  @IsNotEmpty()
  featured_image: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  capacity: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  note: string;
}
