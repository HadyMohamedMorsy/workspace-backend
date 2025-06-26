import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
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
      note: true,
      payment_method: true,
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
      revenue_child: {
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
    return await this.service.create(
      {
        amount: createRevenueChildDto.amount,
        note: createRevenueChildDto.note,
        revenue_child: req["revenueChild"],
        payment_method: createRevenueChildDto.payment_method,
        revenue: req["revenue"],
        createdBy: req["createdBy"],
      } as CreateRevenueChildDto,
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
  async update(@Body() updateRevenueChildDto: UpdateRevenueChildDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: updateRevenueChildDto.id,
        amount: updateRevenueChildDto.amount,
        note: updateRevenueChildDto.note,
        revenue_child: req["revenueChild"],
        payment_method: updateRevenueChildDto.payment_method,
        revenue: updateRevenueChildDto.revenue,
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
  public delete(@Body() { id }: { id: number }) {
    return this.service.delete(id);
  }

  @Patch("/change-payment-method")
  @Permissions([
    {
      resource: Resource.Revenue,
      actions: [Permission.UPDATE],
    },
  ])
  public changePaymentMethod(@Body() update: { id: number; payment_method: string }) {
    return this.service.changeStatus(update.id, update.payment_method, "payment_method", {
      id: true,
      payment_method: true,
    });
  }
}
