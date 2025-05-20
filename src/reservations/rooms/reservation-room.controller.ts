import {
  Body,
  Controller,
  Delete,
  forwardRef,
  HttpCode,
  Inject,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AssignesPackagesService } from "src/assigness-packages-offers/assignes-packages.service";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { DealsService } from "src/deals/deals.service";
import { CreateDepositeDto } from "src/deposit/dto/create-deposites.dto";
import { Permission, ReservationStatus, Resource, TypeUser } from "src/shared/enum/global-enum";
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
        whatsApp: true,
      },
      company: {
        id: true,
        name: true,
        phone: true,
      },
      studentActivity: {
        id: true,
        name: true,
        unviresty: true,
      },
      assignesPackages: {
        id: true,
        name: true,
      },
      deals: {
        id: true,
        name: true,
      },
      assignGeneralOffer: {
        id: true,
        name: true,
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
    return this.service.findAll(filterQueryDto);
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
    const customerType = Object.keys(TypeUser).find(type => req[type]);
    return await this.service.create(
      {
        status: ReservationStatus.ACTIVE,
        package: req["pkg"],
        [customerType]: req[customerType],
        deal: req["deal"],
        assignGeneralOffer: req["assignGeneralOffer"],
        selected_day: createDto.selected_day,
        start_hour: createDto.start_hour,
        start_minute: createDto.start_minute,
        start_time: createDto.start_time,
        createdBy: req["createdBy"],
      } as CreateReservationRoomDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Post("/store/package")
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.CREATE],
    },
  ])
  async createReservationByPackage(
    @Body() createDto: CreateReservationRoomDto,
    @Req() req: Request,
  ) {
    const customer = req["customer"];
    const createdBy = req["createdBy"];
    return await this.service.createReservationByPackage(
      createDto,
      {
        customer,
        createdBy,
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Post("/store/deal")
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.CREATE],
    },
  ])
  async createReservationByDeal(@Body() createDto: CreateReservationRoomDto, @Req() req: Request) {
    const customer = req["customer"];
    const createdBy = req["createdBy"];
    return await this.service.createReservationByDeal(
      createDto,
      {
        customer,
        createdBy,
      },
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
    const customerType = Object.keys(TypeUser).find(type => req[type]);
    return await this.service.update(
      {
        id: updateDto.id,
        status: updateDto.status,
        package: req["pkg"],
        deal: req["deal"],
        total_price: req["total_price"],
        total_time: req["total_time"],
        assignGeneralOffer: req["assignGeneralOffer"],
        [customerType]: req[customerType],
        note: updateDto.note,
        payment_method: updateDto.payment_method,
        selected_day: updateDto.selected_day,
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

  @Post("/store-deposite")
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.CREATE],
    },
  ])
  async createDeposite(@Body() createReservationRoomDto: CreateDepositeDto, @Req() req: Request) {
    const createdBy = req["createdBy"];
    return await this.service.createDeposite(createReservationRoomDto, createdBy);
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

    return this.service.update({
      id: updateDto.id,
      status: ReservationStatus.CANCELLED,
      package: pkg,
      deal: deal,
    });
  }
}
