import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";
import moment from "moment";
import { TypeUser } from "src/orders/enum/type.enum";

export class CreateDealsDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  room_id: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  hours: number;

  @IsString()
  @IsNotEmpty()
  start_date = moment().utc().startOf("day").toDate();

  @IsString()
  @IsNotEmpty()
  end_date = moment().utc().endOf("day").toDate();

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  total: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price_hour: number;

  @IsEnum(TypeUser, {
    message:
      "type order must be one of the following: individual or company or studentActivity or User",
  })
  type_user: TypeUser;

  @ValidateIf(obj => obj.type_user === "individual")
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  individual_id: number;

  @ValidateIf(obj => obj.type_user === "company")
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  company_id: number;

  @ValidateIf(obj => obj.type_user === "studentActivity")
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  studentActivity_id: number;
}
