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
import { CreateDepositeDto } from "src/deposit/dto/create-deposites.dto";
import { ClearCacheAnotherModules } from "src/shared/decorators/clear-cache.decorator";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { ClearCacheAnotherModulesIsnterceptor } from "src/shared/interceptor/caching-delete-antoher-modeule.interceptor";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permissions } from "../../shared/decorators/permissions.decorator";
import { CreateReservationRoomDto } from "./dto/create-reservation-rooms.dto";
import { UpdateReservationRoomDto } from "./dto/update-reservation-rooms.dto";
import { ReservationRoomService } from "./reservation-room.service";

@UseGuards(AuthorizationGuard)
@Controller("reservation-room")
export class ReservationRoomController {
  constructor(private readonly reservationRoomService: ReservationRoomService) {}

  @Post("/all-rooms")
  @UseInterceptors(CachingInterceptor)
  @HttpCode(200)
  async findRoomAll(@Body() filterQueryDto: any) {
    return this.reservationRoomService.findAll(filterQueryDto);
  }

  @Post("/index")
  @UseInterceptors(CachingInterceptor)
  @HttpCode(200)
  async findAll(@Body() filterQueryDto: any) {
    return this.reservationRoomService.getReservationsForThisWeek(filterQueryDto);
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

  @Post("/packages/individual")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividuaPackageRoomAll(@Body() filterQueryDto: any) {
    return this.reservationRoomService.findIndividuaPackageRoomAll(filterQueryDto);
  }

  @Post("/packages/company")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanyPackageRoomAll(@Body() filterQueryDto: any) {
    return this.reservationRoomService.findCompanyPackageRoomAll(filterQueryDto);
  }

  @Post("/packages/studentActivity")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentActivityPackageRoomAll(@Body() filterQueryDto: any) {
    return this.reservationRoomService.findStudentActivityPackageRoomAll(filterQueryDto);
  }

  @Post("/deals/individual")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividualDealAll(@Body() filterQueryDto: any) {
    return this.reservationRoomService.findIndividualDealAll(filterQueryDto);
  }

  @Post("/deals/company")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanyDealAll(@Body() filterQueryDto: any) {
    return this.reservationRoomService.findCompanyDealAll(filterQueryDto);
  }

  @Post("/deals/studentActivity")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentActivityDealAll(@Body() filterQueryDto: any) {
    return this.reservationRoomService.findStudentActivityDealAll(filterQueryDto);
  }

  @Post("/store")
  @ClearCacheAnotherModules([
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
    "/api/v1/user",
    "/api/v1/assign-general-offer",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
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
  @ClearCacheAnotherModules([
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
    "/api/v1/user",
    "/api/v1/assignes-package",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
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
  @ClearCacheAnotherModules([
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
    "/api/v1/user",
    "/api/v1/deals",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
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
  @ClearCacheAnotherModules([
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
    "/api/v1/user",
    "/api/v1/assignes-package",
    "/api/v1/deals",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
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
  @ClearCacheAnotherModules(["/api/v1/deposite"])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
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

  @Post("/update-entity")
  @ClearCacheAnotherModules([
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
    "/api/v1/user",
    "/api/v1/assignes-package",
    "/api/v1/deals",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.ReservationRoom,
      actions: [Permission.UPDATE],
    },
  ])
  async updateEntity(@Body() updateReservationRoomDto: UpdateReservationRoomDto) {
    return await this.reservationRoomService.updateEntity(updateReservationRoomDto);
  }

  @Delete("/delete")
  @UseInterceptors(DeleteCacheInterceptor)
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
