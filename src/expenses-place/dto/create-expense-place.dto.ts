import { IsNotEmpty, IsString } from "class-validator";

export class CreateExpensePlaceDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
