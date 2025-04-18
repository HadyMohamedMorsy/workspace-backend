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
import { Permissions } from "../shared/decorators/permissions.decorator";
import { AssignesPackagesService } from "./assignes-packages.service";
import { CreateAssignesPackageDto } from "./dto/create-assignes-packages.dto";
import { UpdateAssignesPackageDto } from "./dto/update-assignes-packages.dto";

@UseGuards(AuthorizationGuard)
@Controller("assignes-package")
export class AssignesPackageController {
  constructor(private readonly assignesPackagesService: AssignesPackagesService) {}

  @Post("/individual")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividuaAssigneslAll(@Body() filterQueryDto: any) {
    return this.assignesPackagesService.findAssignesByIndividual(filterQueryDto);
  }

  @Post("/company")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanyAssigneslAll(@Body() filterQueryDto: any) {
    return this.assignesPackagesService.findAssignesByCompany(filterQueryDto);
  }

  @Post("/studentActivity")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentActivityAssigneslAll(@Body() filterQueryDto: any) {
    return this.assignesPackagesService.findAssignesByStudentActivity(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.INDEX],
    },
  ])
  async findUserAssigneslAll(@Body() filterQueryDto: any) {
    return this.assignesPackagesService.findAssignesByUser(filterQueryDto);
  }

  @Post("/store")
  @ClearCacheAnotherModules(["/api/v1/individual", "/api/v1/company", "/api/v1/studentActivity"])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createAssignesPackageDto: CreateAssignesPackageDto, @Req() req: Request) {
    const customer = req["customer"];
    const createdBy = req["createdBy"];
    return await this.assignesPackagesService.create(createAssignesPackageDto, {
      customer,
      createdBy,
    });
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
  async createDeposite(
    @Body() createAssignesMembershipDepositeDto: CreateDepositeDto,
    @Req() req: Request,
  ) {
    const createdBy = req["createdBy"];
    return await this.assignesPackagesService.createDeposite(
      createAssignesMembershipDepositeDto,
      createdBy,
    );
  }

  @Post("/update")
  @ClearCacheAnotherModules(["/api/v1/individual", "/api/v1/company", "/api/v1/studentActivity"])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateAssignesPackageDto: UpdateAssignesPackageDto) {
    return await this.assignesPackagesService.update(updateAssignesPackageDto);
  }

  @Post("/update-entity")
  @ClearCacheAnotherModules(["/api/v1/individual", "/api/v1/company", "/api/v1/studentActivity"])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.UPDATE],
    },
  ])
  async updateEntity(@Body() updateAssignesMembershipDto: UpdateAssignesPackageDto) {
    return await this.assignesPackagesService.updateEntity(updateAssignesMembershipDto);
  }

  @Delete("/delete")
  @ClearCacheAnotherModules(["/api/v1/individual", "/api/v1/company", "/api/v1/studentActivity"])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.assignesPackagesService.remove(bodyDelete.id);
  }
}
