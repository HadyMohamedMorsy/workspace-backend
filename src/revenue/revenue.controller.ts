import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateRevenueDto } from "./dto/create-revenue.dto";
import { UpdateRevenueDto } from "./dto/update-revenue.dto";
import { RevenueService } from "./revenue.service";

@UseGuards(AuthorizationGuard)
@Controller("revenue")
export class RevenueController implements SelectOptions, RelationOptions {
  constructor(private readonly service: RevenueService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      total: true,
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
      revenue: {
        id: true,
        name: true,
      },
    };
  }

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Revenue,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Revenue,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createRevenueDto: CreateRevenueDto, @Req() req: Request) {
    return await this.service.create(
      {
        revenue: req["revenue"],
        total: createRevenueDto.total,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Revenue,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateRevenueDto: UpdateRevenueDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: updateRevenueDto.id,
        revenue: req["revenue"],
        total: updateRevenueDto.total,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Revenue,
      actions: [Permission.DELETE],
    },
  ])
  public delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
