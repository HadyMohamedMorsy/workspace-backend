import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { User } from "src/users/user.entity";

export class CreateVacationDto {
  @IsString()
  @IsOptional()
  note: string;

  @IsString()
  @IsNotEmpty()
  selected_day: string;

  user: User;

  createdBy: User;
}
