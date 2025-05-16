import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateGeneralSettingsDto } from "./dto/create-settings.dto";
import { UpdateGeneralSettingsDto } from "./dto/update-settings-packages.dto";
import { GeneralSettingsService } from "./settings.service";

@UseGuards(AuthorizationGuard)
@Controller("general-settings")
export class GeneralSettingsController implements SelectOptions, RelationOptions {
  constructor(private readonly service: GeneralSettingsService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      key: true,
      value: true,
      created_at: true,
      updated_at: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      createdBy: {
        id: true,
        firstName: true,
        lastName: true,
      },
    };
  }

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.GeneralSettings,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/show")
  @HttpCode(200)
  async findOne(@Body() filterQueryDto: any) {
    return this.service.findOne(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.GeneralSettings,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() create: CreateGeneralSettingsDto, @Req() req: Request) {
    return await this.service.create(
      {
        price_shared: create.price_shared,
        price_deskarea: create.price_deskarea,
        full_day_price_deskarea: create.full_day_price_deskarea,
        full_day_price_shared: create.full_day_price_shared,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.GeneralSettings,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() update: UpdateGeneralSettingsDto) {
    return await this.service.update(
      {
        id: update.id,
        price_shared: update.price_shared,
        price_deskarea: update.price_deskarea,
        full_day_price_deskarea: update.full_day_price_deskarea,
        full_day_price_shared: update.full_day_price_shared,
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.GeneralSettings,
      actions: [Permission.DELETE],
    },
  ])
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
