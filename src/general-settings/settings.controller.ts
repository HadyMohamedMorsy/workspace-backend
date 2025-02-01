import { Body, Controller, HttpCode, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateGeneralSettingsDto } from "./dto/create-settings.dto";
import { GeneralSettingsService } from "./settings.service";

@UseGuards(AuthorizationGuard)
@Controller("general-settings")
export class GeneralSettingsController {
  constructor(private readonly generalSettingsService: GeneralSettingsService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.GeneralSettings,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.generalSettingsService.findAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.GeneralSettings,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createGeneralSettingsDto: CreateGeneralSettingsDto) {
    return await this.generalSettingsService.create(createGeneralSettingsDto);
  }
}
