import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateSharedDto } from "./create-shared.dto";

export class UpdateSharedNoteDto extends PartialType(CreateSharedDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
