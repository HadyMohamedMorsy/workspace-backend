import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateAssignesMembershipDto } from "./create-assignes-membership.dto";

export class UpdateAssignesMembershipDto extends PartialType(CreateAssignesMembershipDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
