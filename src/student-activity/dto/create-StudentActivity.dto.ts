import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { User } from "src/users/user.entity";

export class CreateStudentActivityDto {
  @IsString()
  @MaxLength(256)
  name: string;

  @IsString()
  @MaxLength(256)
  unviresty: string;

  @IsString()
  @MaxLength(256)
  college: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  subjects: string[] | [null];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHolderDto)
  holders: CreateHolderDto[];

  createdBy: User;
}

export class CreateHolderDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(11)
  number: string;

  @IsString()
  @IsOptional()
  position: string;

  @IsString()
  @IsNotEmpty()
  whatsApp: string;
}
