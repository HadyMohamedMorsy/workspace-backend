import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateGeneralSettingsDto } from "./create-settings.dto";

export class UpdateGeneralSettingsDto extends PartialType(CreateGeneralSettingsDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
