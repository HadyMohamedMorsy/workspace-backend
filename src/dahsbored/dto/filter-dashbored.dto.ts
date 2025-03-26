import { IsNotEmpty, IsString } from "class-validator";
import * as moment from "moment";

export class FiltersDashboredDto {
  @IsString()
  @IsNotEmpty()
  start_date = moment().utc().startOf("day").toDate();

  @IsString()
  @IsNotEmpty()
  end_date = moment().utc().endOf("day").toDate();

  @IsString()
  @IsNotEmpty()
  slug: string;
}
