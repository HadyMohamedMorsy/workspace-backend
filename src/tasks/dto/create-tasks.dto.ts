import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { TasksStatus } from "src/shared/enum/global-enum";

export class CreateTaskDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  note: string;

  @IsEnum(TasksStatus)
  @IsOptional()
  status: TasksStatus = TasksStatus.ACTIVE;
}
