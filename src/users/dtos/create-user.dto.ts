import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { Permission, Role, UserStatus } from "src/shared/enum/global-enum";
import { User } from "../user.entity";
import { Match } from "./custom/match-password";

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(96)
  lastName?: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(96)
  username: string;

  @IsEnum(UserStatus, {
    message: "Status must be one of the following: active, inactive",
  })
  status: UserStatus = UserStatus.ACTIVE;

  @IsEnum(Role, {
    message:
      "Role must be one of the following: general-manager, operation-manager, community-officer, accountant",
  })
  role: Role;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourcePermissionDto)
  @IsOptional()
  permission: ResourcePermissionDto[];

  @IsString()
  @MaxLength(11)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: "Minimum eight characters, at least one letter, one number and one special character",
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: "Minimum eight characters, at least one letter, one number and one special character",
  })
  @Match("password", { message: "Password confirmation must match password" })
  password_confirmation: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  annual_start: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  annual_increase: number;

  createdBy: User;
}

export class ResourcePermissionDto {
  @IsString()
  resource: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Permission, {
    each: true,
    message: "Each permission must be one of: create, update, delete, view",
  })
  actions: Permission[];
}
