import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateCompanyDto } from "./create-company.dto";

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
