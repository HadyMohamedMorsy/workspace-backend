import { Body, Controller, Delete, HttpCode, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { DepositeService } from "./deposites.service";
import { CreateDepositeDto } from "./dto/create-deposites.dto";
import { UpdateDepositeDto } from "./dto/update-deposites.dto";

@UseGuards(AuthorizationGuard)
@Controller("deposite")
export class DepositesController implements SelectOptions, RelationOptions {
  constructor(private readonly service: DepositeService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      total_price: true,
      status: true,
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
      assignesPackages: {
        id: true,
        total_price: true,
      },
      assignessMemebership: {
        id: true,
        total_price: true,
      },
      reservationRooms: {
        id: true,
        total_price: true,
      },
      deal: {
        id: true,
        total: true,
      },
    };
  }

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createDepositeDto: CreateDepositeDto, @Req() req: Request) {
    return await this.service.create(
      {
        assignMembership: req["assignMembership"],
        assignPackage: req["assignPackage"],
        reservationRoom: req["reservationRoom"],
        deal: req["deal"],
        deskarea: req["deskarea"],
        shared: req["shared"],
        status: createDepositeDto.status,
        total_price: createDepositeDto.total_price,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Post("/update")
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateDepositeDto: UpdateDepositeDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: updateDepositeDto.id,
        assignMembership: req["assignMembership"],
        assignPackage: req["assignPackage"],
        reservationRoom: req["reservationRoom"],
        deal: req["deal"],
        deskarea: req["deskarea"],
        shared: req["shared"],
        status: updateDepositeDto.status,
        total_price: updateDepositeDto.total_price,
        createdBy: req["createdBy"],
      },

      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Patch("/change-payment-method")
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.UPDATE],
    },
  ])
  public changePaymentMethod(@Body() update: { id: number; payment_method: string }) {
    return this.service.changeStatus(update.id, update.payment_method, "payment_method", {
      id: true,
      payment_method: true,
    });
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.DELETE],
    },
  ])
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
