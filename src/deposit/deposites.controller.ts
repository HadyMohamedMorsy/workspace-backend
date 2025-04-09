import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { ClearCacheAnotherModules } from "src/shared/decorators/clear-cache.decorator";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { ClearCacheAnotherModulesIsnterceptor } from "src/shared/interceptor/caching-delete-antoher-modeule.interceptor";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { DepositeService } from "./deposites.service";
import { UpdateDepositeDto } from "./dto/update-deposites.dto";

@UseGuards(AuthorizationGuard)
@Controller("deposite")
export class DepositesController {
  constructor(private readonly depositeService: DepositeService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.depositeService.findAll(filterQueryDto);
  }

  @Post("/update")
  @ClearCacheAnotherModules([
    "/api/v1/assignes-package",
    "/api/v1/deals",
    "/api/v1/reservation-room",
    "/api/v1/assignes-membership",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateDepositeDto: UpdateDepositeDto) {
    return await this.depositeService.update(updateDepositeDto);
  }

  @Delete("/delete")
  @ClearCacheAnotherModules([
    "/api/v1/assignes-package",
    "/api/v1/deals",
    "/api/v1/reservation-room",
    "/api/v1/assignes-membership",
  ])
  @UseInterceptors(DeleteCacheInterceptor, ClearCacheAnotherModulesIsnterceptor)
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.depositeService.remove(bodyDelete.id);
  }
}
