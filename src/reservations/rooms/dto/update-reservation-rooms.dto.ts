import { PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty } from "class-validator";
import { CreateReservationRoomDto } from "./create-reservation-rooms.dto";

export class UpdateReservationRoomDto extends PartialType(CreateReservationRoomDto) {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  id: number;
}
