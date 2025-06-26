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

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  city: Lookup;

  company_type: Lookup;

  @IsString()
  @IsOptional()
  address: string;

  nationality: Lookup;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  featured_image: string;

  @IsString()
  @IsOptional()
  note: string;

  @IsString()
  @MaxLength(11)
  @IsNotEmpty()
  whatsApp: string;

  @IsString()
  @IsOptional()
  facebook: string;

  @IsString()
  @IsOptional()
  website: string;

  @IsString()
  @IsOptional()
  instagram: string;

  @IsString()
  @IsOptional()
  linkedin: string;

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
  @IsNotEmpty()
  whatsApp: string;
}
