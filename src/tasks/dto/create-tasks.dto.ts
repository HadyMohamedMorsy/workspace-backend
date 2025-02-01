import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTaskDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  created_by: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  note: string;
}
