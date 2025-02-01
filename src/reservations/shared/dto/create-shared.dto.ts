import { IsNotEmpty, IsString } from "class-validator";

export class CreateSharedDto {
  @IsString()
  @IsNotEmpty()
  type_store: string;

  @IsString()
  @IsNotEmpty()
  note: string;
}
