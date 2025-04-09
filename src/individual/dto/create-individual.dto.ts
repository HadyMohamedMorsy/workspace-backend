import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from "class-validator";

export class CreateIndividualDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(11)
  @IsOptional()
  number: string;

  @IsString()
  @IsNotEmpty()
  whatsApp: string;

  @IsString()
  @IsNotEmpty()
  individual_type: string;

  @ValidateIf(obj => obj.individual_type === "employed")
  @IsString()
  @IsNotEmpty()
  employed_job: string;

  @ValidateIf(obj => obj.individual_type === "freelancer")
  @IsString()
  @IsOptional()
  freelancer_job: string;

  @ValidateIf(obj => obj.individual_type === "student")
  @IsString()
  @IsOptional()
  unviresty: string;

  @ValidateIf(obj => obj.individual_type === "student")
  @IsString()
  @IsOptional()
  college: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;
}
