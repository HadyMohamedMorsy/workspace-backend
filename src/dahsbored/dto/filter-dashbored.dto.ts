import { IsNotEmpty, IsString } from "class-validator";
import * as moment from "moment";

export class FiltersDashboredDto {
  @IsString()
  @IsNotEmpty()
  start_from = moment().utc().startOf("day").toDate();

  @IsString()
  @IsNotEmpty()
  start_to = moment().utc().endOf("day").toDate();
}
