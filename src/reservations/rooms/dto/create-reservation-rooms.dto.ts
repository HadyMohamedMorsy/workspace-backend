import { IsNotEmpty, IsString } from "class-validator";

export class CreateReservationRoomDto {
  @IsString()
  @IsNotEmpty()
  type_store: string;

  @IsString()
  @IsNotEmpty()
  note: string;
}
