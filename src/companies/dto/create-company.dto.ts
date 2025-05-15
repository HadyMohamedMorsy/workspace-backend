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
import { CompanyType } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";

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
  @IsNotEmpty()
  nationality: string;

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
