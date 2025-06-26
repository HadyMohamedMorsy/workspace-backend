import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateLookupDto } from "./create-lookup.dto";

export class UpdateLookupDto extends PartialType(CreateLookupDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
