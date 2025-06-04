import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../../shared/decorators/permissions.decorator";
import { CreateRevenueChildDto } from "./dto/create-revenue-child.dto";
import { UpdateRevenueChildDto } from "./dto/update-revenue-child.dto";
import { RevenueChildService } from "./revenue-child.service";

@UseGuards(AuthorizationGuard)
@Controller("revenue-child")
export class RevenueChildController implements SelectOptions, RelationOptions {
  constructor(private readonly service: RevenueChildService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      amount: true,
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
  async create(@Body() createRevenueChildDto: CreateRevenueChildDto, @Req() req: Request) {
    return await this.service.create({
      amount: createRevenueChildDto.amount,
      revenue: req["revenue"],
      createdBy: req["createdBy"],
    } as CreateRevenueChildDto);
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Revenue,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateRevenueChildDto: UpdateRevenueChildDto, @Req() req: Request) {
    return await this.service.update({
      id: updateRevenueChildDto.id,
      amount: updateRevenueChildDto.amount,
      revenue: updateRevenueChildDto.revenue,
      createdBy: req["createdBy"],
    });
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Revenue,
      actions: [Permission.DELETE],
    },
  ])
  public delete(@Body() { id }: { id: number }) {
    return this.service.delete(id);
  }
}
