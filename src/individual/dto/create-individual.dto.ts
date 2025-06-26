import { IsNotEmpty, IsOptional, IsString, MaxLength, ValidateIf } from "class-validator";
import { Lookup } from "src/lookups/lookup.entity";
import { User } from "src/users/user.entity";

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
  unviresty: Lookup;

  @ValidateIf(obj => obj.individual_type === "student")
  college: Lookup;

  nationality: Lookup;

  @IsString()
  @IsOptional()
  note: string;

  createdBy: User;
}
