import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { RoomsService } from "./rooms.service";

@UseGuards(AuthorizationGuard)
@Controller("rooms")
export class RoomsController implements SelectOptions, RelationOptions {
  constructor(private readonly service: RoomsService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      name: true,
      featured_image: true,
      capacity: true,
      price: true,
      note: true,
      created_at: true,
      updated_at: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      createdBy: {
        id: true,
        firstName: true,
        lastName: true,
      },
    };
  }

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Rooms,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Rooms,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createRoomDto: CreateRoomDto, @Req() req: Request) {
    return await this.service.create(
      {
        name: createRoomDto.name,
        featured_image: createRoomDto.featured_image,
        capacity: createRoomDto.capacity,
        price: createRoomDto.price,
        note: createRoomDto.note,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Rooms,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateRoomDto: UpdateRoomDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: updateRoomDto.id,
        name: updateRoomDto.name,
        featured_image: updateRoomDto.featured_image,
        capacity: updateRoomDto.capacity,
        price: updateRoomDto.price,
        note: updateRoomDto.note,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Rooms,
      actions: [Permission.DELETE],
    },
  ])
  public delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
