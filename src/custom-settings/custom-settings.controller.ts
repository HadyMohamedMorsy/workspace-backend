import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CustomSettingsService } from "./custom-settings.service";
import { CreateCustomSettingsDto } from "./dto/create-custom-settings.dto";
import { UpdateCustomSettingsDto } from "./dto/update-custom-settings.dto";

@UseGuards(AuthorizationGuard)
@Controller("custom-settings")
export class CustomSettingsController implements SelectOptions, RelationOptions {
  constructor(private readonly service: CustomSettingsService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      price_shared: true,
      price_deskarea: true,
      full_day_price_deskarea: true,
      full_day_price_shared: true,
      full_day_hours: true,
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
      individual: {
        id: true,
        name: true,
        number: true,
      },
      company: {
        id: true,
        name: true,
        phone: true,
      },
      studentActivity: {
        id: true,
        name: true,
      },
    };
  }

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.CustomSettings,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/show")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.CustomSettings,
      actions: [Permission.VIEW],
    },
  ])
  async findOne(@Body() filterQueryDto: any) {
    return this.service.findOne(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  async getSettingsForUser(@Req() req: any) {
    const customer_type = req["customer_type"];
    const customer_id = req.body.customer_id;
    return this.service.getSettingsForUser(customer_type, customer_id);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.CustomSettings,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createDto: CreateCustomSettingsDto, @Req() req: any) {
    return await this.service.create(
      {
        price_shared: createDto.price_shared,
        price_deskarea: createDto.price_deskarea,
        full_day_price_deskarea: createDto.full_day_price_deskarea,
        full_day_price_shared: createDto.full_day_price_shared,
        full_day_hours: createDto.full_day_hours,
        individual: req["individual"],
        company: req["company"],
        studentActivity: req["studentActivity"],
        is_active: createDto.is_active,
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.CustomSettings,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateDto: UpdateCustomSettingsDto, @Req() req: any) {
    return await this.service.update(
      {
        id: updateDto.id,
        price_shared: updateDto.price_shared,
        price_deskarea: updateDto.price_deskarea,
        full_day_price_deskarea: updateDto.full_day_price_deskarea,
        full_day_price_shared: updateDto.full_day_price_shared,
        full_day_hours: updateDto.full_day_hours,
        individual: req["individual"],
        company: req["company"],
        studentActivity: req["studentActivity"],
        is_active: updateDto.is_active,
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.CustomSettings,
      actions: [Permission.DELETE],
    },
  ])
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
