import { PartialType } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { CreateCustomSettingsDto } from "./create-custom-settings.dto";

export class UpdateCustomSettingsDto extends PartialType(CreateCustomSettingsDto) {
  @IsNumber()
  id: number;
}
