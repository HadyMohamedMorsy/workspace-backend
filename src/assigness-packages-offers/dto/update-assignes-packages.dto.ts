import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateAssignesPackageDto } from "./create-assignes-packages.dto";

export class UpdateAssignesPackageDto extends PartialType(CreateAssignesPackageDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
