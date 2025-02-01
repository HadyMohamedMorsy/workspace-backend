import { IsNotEmpty, IsString } from "class-validator";

export class CreateDeskAreaDto {
  @IsString()
  @IsNotEmpty()
  type_store: string;

  @IsString()
  @IsNotEmpty()
  note: string;
}
