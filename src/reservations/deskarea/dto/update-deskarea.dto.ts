import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Validate,
  ValidateIf,
} from "class-validator";
import { ReservationStatus, TimeOfDay } from "src/shared/enum/global-enum";
import { IsStartBeforeEndValidator } from "src/shared/validations/is-start-hour-validation";
import { CreateDeskAreaDto } from "./create-deskarea.dto";

export class UpdateDeskAreaDto extends PartialType(CreateDeskAreaDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;

  @ValidateIf(o => o.status !== ReservationStatus.CANCELLED)
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  end_hour: number;

  @ValidateIf(o => o.status !== ReservationStatus.CANCELLED)
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  end_minute: number;

  @ValidateIf(o => o.status !== ReservationStatus.CANCELLED)
  @IsString()
  @IsNotEmpty()
  @IsEnum(TimeOfDay)
  end_time: TimeOfDay;

  @ValidateIf(o => o.status !== ReservationStatus.CANCELLED)
  @Validate(IsStartBeforeEndValidator)
  validate_time: boolean;
}
