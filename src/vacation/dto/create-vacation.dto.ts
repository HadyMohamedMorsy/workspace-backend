import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column } from "typeorm";

export class CreateVacationDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  user_id: number;

  @Column()
  selected_day: string;

  @IsString()
  @IsNotEmpty()
  note: string;
}
