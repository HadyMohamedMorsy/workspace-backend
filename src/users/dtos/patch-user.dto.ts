import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

export class PatchUserDto extends PartialType(CreateUserDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
