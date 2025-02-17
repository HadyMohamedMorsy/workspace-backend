import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";
import { ReservationStatus, TimeOfDay } from "src/shared/enum/global-enum";
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

  // @ValidateIf(o => o.status !== ReservationStatus.CANCELLED)
  // @Validate(ValidateTimeReservationValidator)
  // validate_time: boolean;
}
