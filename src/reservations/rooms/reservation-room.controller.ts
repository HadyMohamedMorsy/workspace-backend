import {
  Body,
  Controller,
  Delete,
  forwardRef,
  HttpCode,
  Inject,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AssignesPackagesService } from "src/assigness-packages-offers/assignes-packages.service";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { DealsService } from "src/deals/deals.service";
import { CreateDepositeDto } from "src/deposit/dto/create-deposites.dto";
import { Permission, ReservationStatus, Resource } from "src/shared/enum/global-enum";
import { Permissions } from "../../shared/decorators/permissions.decorator";
import { CreateReservationRoomDto } from "./dto/create-reservation-rooms.dto";
import { UpdateReservationRoomDto } from "./dto/update-reservation-rooms.dto";
import { ReservationCalendarService } from "./reservation-calendar.service";
import { ReservationRoomQueryService } from "./reservation-room-query.service";
import { ReservationRoomService } from "./reservation-room.service";

@UseGuards(AuthorizationGuard)
@Controller("reservation-room")
export class ReservationRoomController {
  constructor(
    private readonly reservationRoomService: ReservationRoomService,
    @Inject(forwardRef(() => DealsService))
    private readonly deal: DealsService,
    @Inject(forwardRef(() => AssignesPackagesService))
    private readonly packageRooms: AssignesPackagesService,
    private readonly reservationRoomQueryService: ReservationRoomQueryService,
    private readonly reservationCalendarService: ReservationCalendarService,
  ) {}

  @Post("/all-rooms")
  @HttpCode(200)
  async findRoomAll(@Body() filterQueryDto: any) {
    return this.reservationRoomService.findAll(filterQueryDto);
  }

  @Post("/index")
  @HttpCode(200)
  async findAll(@Body() filterQueryDto: any) {
    return this.reservationCalendarService.getReservationsForThisWeek(filterQueryDto);
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
    return this.reservationRoomQueryService.findRoomsByIndividualAll(filterQueryDto);
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
    return this.reservationRoomQueryService.findRoomsByStudentActivityAll(filterQueryDto);
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
    return this.reservationRoomQueryService.findRoomsByCompanyAll(filterQueryDto);
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
    return this.reservationRoomQueryService.findRoomsByUserAll(filterQueryDto);
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
    return this.reservationRoomQueryService.findIndividualPackageRoomAll(filterQueryDto);
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
    return this.reservationRoomQueryService.findCompanyPackageRoomAll(filterQueryDto);
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
    return this.reservationRoomQueryService.findStudentActivityPackageRoomAll(filterQueryDto);
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
    return this.reservationRoomQueryService.findIndividualDealAll(filterQueryDto);
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
    return this.reservationRoomQueryService.findCompanyDealAll(filterQueryDto);
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
    return this.reservationRoomQueryService.findStudentActivityDealAll(filterQueryDto);
  }

  @Post("/store")
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

  @Post("/store/package")
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.CREATE],
    },
  ])
  async createReservationByPackage(
    @Body() createReservationRoomDto: CreateReservationRoomDto,
    @Req() req: Request,
  ) {
    const customer = req["customer"];
    const createdBy = req["createdBy"];
    return await this.reservationRoomService.createReservationByPackage(createReservationRoomDto, {
      customer,
      createdBy,
    });
  }
  @Post("/store/deal")
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.CREATE],
    },
  ])
  async createReservationByDeal(
    @Body() createReservationRoomDto: CreateReservationRoomDto,
    @Req() req: Request,
  ) {
    const customer = req["customer"];
    const createdBy = req["createdBy"];
    return await this.reservationRoomService.createReservationByDeal(createReservationRoomDto, {
      customer,
      createdBy,
    });
  }

  @Post("/update")
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateReservationRoomDto: UpdateReservationRoomDto) {
    return await this.reservationRoomService.update(updateReservationRoomDto);
  }

  @Post("/store-deposite")
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.CREATE],
    },
  ])
  async createDeposite(@Body() createReservationRoomDto: CreateDepositeDto, @Req() req: Request) {
    const createdBy = req["createdBy"];
    return await this.reservationRoomService.createDeposite(createReservationRoomDto, createdBy);
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.reservationRoomService.remove(bodyDelete.id);
  }

  @Post("cancel")
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.UPDATE],
    },
  ])
  async cancelReservation(@Body() updateDto: UpdateReservationRoomDto, @Req() req: Request) {
    const pkg = req["pkg"];
    const deal = req["deal"];
    const diffHours = req["diffHours"];

    if (pkg) {
      await this.packageRooms.update({
        id: pkg.id,
        used: pkg.used - diffHours,
        remaining: pkg.remaining + diffHours,
      });
    }

    if (deal) {
      await this.deal.update({
        id: deal.id,
        used: deal.used - diffHours,
        remaining: deal.remaining + diffHours,
      });
    }

    return this.reservationRoomService.update({
      id: updateDto.id,
      status: ReservationStatus.CANCELLED,
      package: pkg,
      deal: deal,
    });
  }
}
