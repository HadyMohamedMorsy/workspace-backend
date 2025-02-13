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
import { ClearCacheAnotherModules } from "src/shared/decorators/clear-cache.decorator";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { ClearCacheAnotherModulesIsnterceptor } from "src/shared/interceptor/caching-delete-antoher-modeule.interceptor";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permissions } from "../../shared/decorators/permissions.decorator";
import { CreateSharedDto } from "./dto/create-shared.dto";
import { UpdateSharedDto } from "./dto/update-shared.dto";
import { SharedService } from "./shared.service";

@UseGuards(AuthorizationGuard)
@Controller("shared")
export class SharedController {
  constructor(private readonly sharedService: SharedService) {}

  @Post("/index")
  @UseInterceptors(CachingInterceptor)
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.sharedService.findAll(filterQueryDto);
  }

  @Post("/individual")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividuaSharedAll(@Body() filterQueryDto: any) {
    return this.sharedService.findSharedByIndividualAll(filterQueryDto);
  }

  @Post("/company")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanySharedAll(@Body() filterQueryDto: any) {
    return this.sharedService.findSharedByComapnyAll(filterQueryDto);
  }

  @Post("/studentActivity")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentSharedAll(@Body() filterQueryDto: any) {
    return this.sharedService.findSharedByStudentActivityAll(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.INDEX],
    },
  ])
  async findUserSharedAll(@Body() filterQueryDto: any) {
    return this.sharedService.findSharedByUserAll(filterQueryDto);
  }

  @Post("/store")
  @ClearCacheAnotherModules([
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
    "/api/v1/assign-general-offer/company",
    "/api/v1/assign-general-offer/studentActivity",
    "/api/v1/assign-general-offer/user",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createSharedDto: CreateSharedDto, @Req() req: Request) {
    const customer = req["customer"];
    const createdBy = req["createdBy"];
    return await this.sharedService.create(createSharedDto, {
      customer,
      createdBy,
    });
  }
  @Post("/store/reservation")
  @ClearCacheAnotherModules([
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
    "/api/v1/assign-general-offer/company",
    "/api/v1/assign-general-offer/studentActivity",
    "/api/v1/assign-general-offer/user",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.CREATE],
    },
  ])
  async createReservationByMememberShip(
    @Body() createSharedDto: CreateSharedDto,
    @Req() req: Request,
  ) {
    const customer = req["customer"];
    const createdBy = req["createdBy"];
    return await this.sharedService.createReservationByMememberShip(createSharedDto, {
      customer,
      createdBy,
    });
  }

  @Post("reservation/individual")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.AssignGeneralOffer,
      actions: [Permission.INDEX],
    },
  ])
  async findReservationIndividualAll(@Body() filterQueryDto: any) {
    return this.sharedService.findReservationsByIndividual(filterQueryDto);
  }

  @Post("reservation/company")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.AssignGeneralOffer,
      actions: [Permission.INDEX],
    },
  ])
  async findReservationCompanyAll(@Body() filterQueryDto: any) {
    return this.sharedService.findReservationsByCompany(filterQueryDto);
  }

  @Post("reservation/studentActivity")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.AssignGeneralOffer,
      actions: [Permission.INDEX],
    },
  ])
  async findReservationStudentActivityAll(@Body() filterQueryDto: any) {
    return this.sharedService.findReservationsByStudentActivity(filterQueryDto);
  }

  @Post("/update")
  @ClearCacheAnotherModules([
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
    "/api/v1/user",
    "/api/v1/assign-general-offer/company",
    "/api/v1/assign-general-offer/studentActivity",
    "/api/v1/assign-general-offer/individual",
    "/api/v1/assign-general-offer/user",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateSharedDto: UpdateSharedDto) {
    return await this.sharedService.update(updateSharedDto);
  }

  @Delete("/delete")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.sharedService.remove(bodyDelete.id);
  }
}
