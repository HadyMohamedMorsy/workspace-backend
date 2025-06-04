import { IsNotEmpty, IsString } from "class-validator";
import { User } from "src/users/user.entity";

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  createdBy?: User;
}
