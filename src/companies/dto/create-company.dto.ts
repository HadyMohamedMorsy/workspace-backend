import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";

export enum CompanyType {
  GENERAL = "General",
  NGOS = "NGOs",
}

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsEnum(CompanyType, { message: 'company_type must be either "General" or "NGOs"' })
  company_type: CompanyType;

  @IsString()
  @IsOptional()
  address: string;

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
