import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateDeskAreaDto } from "./create-deskarea.dto";

export class UpdateDekareaNoteDto extends PartialType(CreateDeskAreaDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
