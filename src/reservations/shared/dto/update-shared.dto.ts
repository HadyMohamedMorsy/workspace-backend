import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";
import { TimeOfDay } from "src/shared/enum/global-enum";
import { IsNotPastTimeGroupValidator } from "src/shared/validations/is-current-time";
import { IsStartBeforeEndValidator } from "src/shared/validations/is-start-hour-validation";
import { CreateSharedDto } from "./create-shared.dto";

export class UpdateSharedDto extends PartialType(CreateSharedDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  end_hour: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  end_minute: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TimeOfDay)
  end_time: TimeOfDay;

  @Validate(IsStartBeforeEndValidator)
  validate_time: boolean;

  @Validate(IsNotPastTimeGroupValidator)
  validateStartTimeGroup: boolean;
}
