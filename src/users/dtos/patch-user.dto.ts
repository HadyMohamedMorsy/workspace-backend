import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { UserDto } from "./create-user.dto";

export class PatchUserDto extends PartialType(UserDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
