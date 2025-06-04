import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { Room } from "src/rooms/room.entity";
import { User } from "src/users/user.entity";

export class CreateOfferPackagesDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  hours: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  room_id: number;

  room: Room;

  createdBy: User;
}
