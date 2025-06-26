import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { Lookup } from "src/lookups/lookup.entity";
import { User } from "src/users/user.entity";

export class CreateStudentActivityDto {
  @IsString()
  @MaxLength(256)
  name: string;

  unviresty: Lookup;

  college: Lookup;

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
