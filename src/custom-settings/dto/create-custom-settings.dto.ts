import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsOptional, Min, ValidateNested } from "class-validator";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";

class RoomSettingDto {
  @IsNumber()
  @Type(() => Number)
  id: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  value: number;
}

export class CreateCustomSettingsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price_shared?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price_deskarea?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  full_day_price_deskarea?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  full_day_price_shared?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  full_day_hours?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_active?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomSettingDto)
  rooms?: Array<{ id: number; value: number }>;

  @IsOptional()
  @IsNumber()
  customer_id?: number;

  individual?: Individual;
  company?: Company;
  studentActivity?: StudentActivity;
  createdBy?: User;
}
