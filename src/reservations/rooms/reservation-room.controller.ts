import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { EntityName } from "src/shared/decorators/entity-name.decorator";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { EntityIsExistInterceptor } from "src/shared/interceptor/entity-isexist.interceptor";
import { Permissions } from "../../shared/decorators/permissions.decorator";
import { CreateReservationRoomDto } from "./dto/create-reservation-rooms.dto";
import { UpdateReservationRoomDto } from "./dto/update-reservation-rooms.dto";
import { ReservationRoomService } from "./reservation-room.service";

@UseGuards(AuthorizationGuard)
@Controller("reservation-room")
export class ReservationRoomController {
  constructor(private readonly reservationRoomService: ReservationRoomService) {}

  @Post("/index")
  @UseInterceptors(CachingInterceptor)
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.reservationRoomService.findAll(filterQueryDto);
  }

  @Post("/individual")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividuaRoomAll(@Body() filterQueryDto: any) {
    return this.reservationRoomService.findRoomsByIndividualAll(filterQueryDto);
  }

  @Post("/studentActivity")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentRoomAll(@Body() filterQueryDto: any) {
    return this.reservationRoomService.findRoomsByStudentActivityAll(filterQueryDto);
  }

  @Post("/company")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanyRoomAll(@Body() filterQueryDto: any) {
    return this.reservationRoomService.findRoomsByComapnyAll(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findUserRoomAll(@Body() filterQueryDto: any) {
    return this.reservationRoomService.findRoomsByUserAll(filterQueryDto);
  }

  @Post("/store")
  @EntityName("reservation-room")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createReservationRoomDto: CreateReservationRoomDto, @Req() req: Request) {
    const customer = req["customer"];
    const createdBy = req["createdBy"];
    return await this.reservationRoomService.create(createReservationRoomDto, {
      customer,
      createdBy,
    });
  }

  @Post("/update")
  @EntityName("reservation-room")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateReservationRoomDto: UpdateReservationRoomDto) {
    return await this.reservationRoomService.update(updateReservationRoomDto);
  }

  @Delete("/delete")
  @EntityName("reservation-room")
  @UseInterceptors(DeleteCacheInterceptor, EntityIsExistInterceptor)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.reservationRoomService.remove(bodyDelete.id);
  }
}
