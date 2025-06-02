import {
  Body,
  Controller,
  Delete,
  forwardRef,
  HttpCode,
  Inject,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AssignesPackagesService } from "src/assigness-packages-offers/assignes-packages.service";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { DealsService } from "src/deals/deals.service";
import { formatDate } from "src/reservations/helpers/utitlties";
import { Permission, ReservationStatus, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../../shared/decorators/permissions.decorator";
import { CreateReservationRoomDto } from "./dto/create-reservation-rooms.dto";
import { UpdateReservationRoomDto } from "./dto/update-reservation-rooms.dto";
import { ReservationCalendarService } from "./reservation-calendar.service";
import { ReservationRoomQueryService } from "./reservation-room-query.service";
import { ReservationRoomService } from "./reservation-room.service";

@UseGuards(AuthorizationGuard)
@Controller("reservation-room")
export class ReservationRoomController implements SelectOptions, RelationOptions {
  constructor(
    private readonly service: ReservationRoomService,
    @Inject(forwardRef(() => DealsService))
    private readonly deal: DealsService,
    @Inject(forwardRef(() => AssignesPackagesService))
    private readonly packageRooms: AssignesPackagesService,
    private readonly queryService: ReservationRoomQueryService,
    private readonly calendarService: ReservationCalendarService,
  ) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      selected_day: true,
      status: true,
      start_hour: true,
      start_minute: true,
      start_time: true,
      end_hour: true,
      end_minute: true,
      end_time: true,
      total_price: true,
      total_time: true,
      note: true,
      payment_method: true,
      created_at: true,
      updated_at: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      room: {
        id: true,
        name: true,
        featured_image: true,
        capacity: true,
        price: true,
      },
      individual: {
        id: true,
        name: true,
      },
      company: {
        id: true,
        name: true,
      },
      studentActivity: {
        id: true,
        name: true,
      },
      assignesPackages: {
        id: true,
      },
      deals: {
        id: true,
      },
      assignGeneralOffer: {
        id: true,
      },
      deposites: {
        id: true,
        total_price: true,
      },
      createdBy: {
        id: true,
        firstName: true,
        lastName: true,
      },
    };
  }

  @Post("/all-rooms")
  @HttpCode(200)
  async findRoomAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.calendarService.getReservationsForThisWeek(filterQueryDto);
  }

  @Post("/individual")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividuaRoomAll(@Body() filterQueryDto: any) {
    return this.queryService.findRoomsByIndividualAll(filterQueryDto);
  }

  @Post("/studentActivity")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentRoomAll(@Body() filterQueryDto: any) {
    return this.queryService.findRoomsByStudentActivityAll(filterQueryDto);
  }

  @Post("/company")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanyRoomAll(@Body() filterQueryDto: any) {
    return this.queryService.findRoomsByCompanyAll(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findUserRoomAll(@Body() filterQueryDto: any) {
    return this.queryService.findRoomsByUserAll(filterQueryDto);
  }

  @Post("/packages/individual")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividuaPackageRoomAll(@Body() filterQueryDto: any) {
    return this.queryService.findIndividualPackageRoomAll(filterQueryDto);
  }

  @Post("/packages/company")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanyPackageRoomAll(@Body() filterQueryDto: any) {
    return this.queryService.findCompanyPackageRoomAll(filterQueryDto);
  }

  @Post("/packages/studentActivity")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentActivityPackageRoomAll(@Body() filterQueryDto: any) {
    return this.queryService.findStudentActivityPackageRoomAll(filterQueryDto);
  }

  @Post("/deals/individual")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividualDealAll(@Body() filterQueryDto: any) {
    return this.queryService.findIndividualDealAll(filterQueryDto);
  }

  @Post("/deals/company")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanyDealAll(@Body() filterQueryDto: any) {
    return this.queryService.findCompanyDealAll(filterQueryDto);
  }

  @Post("/deals/studentActivity")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentActivityDealAll(@Body() filterQueryDto: any) {
    return this.queryService.findStudentActivityDealAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createDto: CreateReservationRoomDto, @Req() req: Request) {
    return await this.service.create(
      {
        status: ReservationStatus.ACTIVE,
        individual: req["individual"],
        company: req["company"],
        studentActivity: req["studentActivity"],
        assignGeneralOffer: req["assignGeneralOffer"],
        room: req["room"],
        deposites: req["deposite"],
        deals: req["deal"],
        assignesPackages: req["assignPackage"],
        selected_day: formatDate(createDto.selected_day),
        start_hour: createDto.start_hour,
        start_minute: createDto.start_minute,
        start_time: createDto.start_time,
        end_hour: createDto.end_hour,
        end_minute: createDto.end_minute,
        end_time: createDto.end_time,
        createdBy: req["createdBy"],
      } as CreateReservationRoomDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateDto: UpdateReservationRoomDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: updateDto.id,
        status: updateDto.status,
        deals: req["deal"],
        total_price: req["total_price"],
        total_time: req["total_time"],
        assignGeneralOffer: req["assignGeneralOffer"],
        assignesPackages: req["assignPackage"],
        room: req["room"],
        deposites: req["deposite"],
        note: updateDto.note,
        payment_method: updateDto.payment_method,
        selected_day: formatDate(updateDto.selected_day),
        start_hour: updateDto.start_hour,
        start_minute: updateDto.start_minute,
        end_hour: updateDto.end_hour,
        end_minute: updateDto.end_minute,
        start_time: updateDto.start_time,
        end_time: updateDto.end_time,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Post("/deposit")
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.CREATE],
    },
  ])
  async createDeposite(@Body() create: { reservation_room_id: number }, @Req() req: Request) {
    console.log(req["deposite"], create.reservation_room_id);
    return await this.service.update({
      id: create.reservation_room_id,
      deposites: req["deposite"],
    });
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.DELETE],
    },
  ])
  public delete(@Body() id: number) {
    return this.service.delete(id);
  }

  @Patch("/change-payment-method")
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.UPDATE],
    },
  ])
  public changePaymentMethod(@Body() update: { id: number; payment_method: string }) {
    return this.service.changeStatus(update.id, update.payment_method, "payment_method", {
      id: true,
      payment_method: true,
    });
  }

  @Patch("/change-status")
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.UPDATE],
    },
  ])
  public changeStatus(@Body() update: { id: number; status: boolean }) {
    return this.service.changeStatus(update.id, update.status, "status", {
      id: true,
      status: true,
    });
  }
}
