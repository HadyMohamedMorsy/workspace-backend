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
import { DeskareaService } from "./deskarea.service";
import { CreateDeskAreaDto } from "./dto/create-deskarea.dto";
import { UpdateDekareaNoteDto } from "./dto/update-deskarea.-note.dto";
import { UpdateDeskAreaDto } from "./dto/update-deskarea.dto";

@UseGuards(AuthorizationGuard)
@Controller("deskarea")
export class DeskareaController {
  constructor(private readonly deskareaService: DeskareaService) {}

  @Post("/index")
  @UseInterceptors(CachingInterceptor)
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.deskareaService.findAll(filterQueryDto);
  }

  @Post("/individual")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividuaDeskareaAll(@Body() filterQueryDto: any) {
    return this.deskareaService.findDeskareaByIndividualAll(filterQueryDto);
  }

  @Post("/company")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanyDeskareaAll(@Body() filterQueryDto: any) {
    return this.deskareaService.findDeskareaByComapnyAll(filterQueryDto);
  }

  @Post("/studentActivity")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentDeskareaAll(@Body() filterQueryDto: any) {
    return this.deskareaService.findDeskareaByStudentActivityAll(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.INDEX],
    },
  ])
  async findUserDeskareaAll(@Body() filterQueryDto: any) {
    return this.deskareaService.findDeskareaByUserAll(filterQueryDto);
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
      resource: Resource.Deskarea,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createDeskareaDto: CreateDeskAreaDto, @Req() req: Request) {
    const customer = req["customer"];
    const createdBy = req["createdBy"];
    return await this.deskareaService.create(createDeskareaDto, {
      customer,
      createdBy,
    });
  }

  @Post("/store/reservation")
  @ClearCacheAnotherModules([
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
    "/api/v1/user",
    "/api/v1/assignes-membership",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.CREATE],
    },
  ])
  async createReservationByMememberShip(
    @Body() createSharedAreaDto: CreateDeskAreaDto,
    @Req() req: Request,
  ) {
    const customer = req["customer"];
    const createdBy = req["createdBy"];
    return await this.deskareaService.createReservationByMememberShip(createSharedAreaDto, {
      customer,
      createdBy,
    });
  }

  @Post("reservation/individual")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.INDEX],
    },
  ])
  async findReservationIndividualAll(@Body() filterQueryDto: any) {
    return this.deskareaService.findReservationsByIndividual(filterQueryDto);
  }

  @Post("reservation/company")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.INDEX],
    },
  ])
  async findReservationCompanyAll(@Body() filterQueryDto: any) {
    return this.deskareaService.findReservationsByCompany(filterQueryDto);
  }

  @Post("reservation/studentActivity")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.INDEX],
    },
  ])
  async findReservationStudentActivityAll(@Body() filterQueryDto: any) {
    return this.deskareaService.findReservationsByStudentActivity(filterQueryDto);
  }

  @Post("/update")
  @ClearCacheAnotherModules([
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
    "/api/v1/user",
    "/api/v1/assign-general-offer",
    "/api/v1/assignes-membership",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateDeskareaDto: UpdateDeskAreaDto) {
    return await this.deskareaService.update(updateDeskareaDto);
  }

  @Post("/update-entity")
  @ClearCacheAnotherModules([
    "/api/v1/individual",
    "/api/v1/company",
    "/api/v1/studentActivity",
    "/api/v1/user",
    "/api/v1/assign-general-offer",
    "/api/v1/assignes-membership",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.UPDATE],
    },
  ])
  async updateEntity(@Body() updateDeskareaDto: UpdateDekareaNoteDto) {
    return await this.deskareaService.updateEntity(updateDeskareaDto);
  }

  @Delete("/delete")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.deskareaService.remove(bodyDelete.id);
  }
}
