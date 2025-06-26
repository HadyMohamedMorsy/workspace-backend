import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Module } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { Lookup } from "../lookup.entity";

export class CreateLookupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  parent?: Lookup;

  @IsOptional()
  @IsBoolean()
  is_parent?: boolean;

  @IsOptional()
  @IsEnum(Module)
  module?: Module;

  createdBy: User;
}
