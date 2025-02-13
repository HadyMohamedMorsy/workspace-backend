import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";
import { ReservationStatus, TimeOfDay } from "src/shared/enum/global-enum";
import { CreateSharedDto } from "./create-shared.dto";

export class UpdateSharedDto extends PartialType(CreateSharedDto) {
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
}
