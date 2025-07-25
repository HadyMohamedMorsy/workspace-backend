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
import { Permissions } from "../shared/decorators/permissions.decorator";
import { DealsService } from "./deals.service";
import { CreateDealsDto } from "./dto/create-deals.dto";
import { UpdateDealsDto } from "./dto/update-deals.dto";

@UseGuards(AuthorizationGuard)
@Controller("deals")
export class DealsController implements SelectOptions, RelationOptions {
  constructor(private readonly service: DealsService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      hours: true,
      start_date: true,
      end_date: true,
      price_hour: true,
      total_price: true,
      used: true,
      total_used: true,
      remaining: true,
      payment_method: true,
      status: true,
      deposites: true,
      is_paid: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      createdBy: {
        id: true,
        firstName: true,
        lastName: true,
      },
      assignGeneralOffer: {
        id: true,
      },
      room: {
        id: true,
        name: true,
      },
      individual: {
        id: true,
      },
      company: {
        id: true,
      },
      studentActivity: {
        id: true,
      },
      reservationRooms: {
        id: true,
      },
    };
  }

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/individual")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividuaDealsAll(@Body() filterQueryDto: any) {
    return this.service.findDealsByIndividualAll(filterQueryDto);
  }

  @Post("/studentActivity")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentDealsAll(@Body() filterQueryDto: any) {
    return this.service.findDealsByStudentActivityAll(filterQueryDto);
  }

  @Post("/company")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanyDealsAll(@Body() filterQueryDto: any) {
    return this.service.findDealsByComapnyAll(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.INDEX],
    },
  ])
  async findUserDealsAll(@Body() filterQueryDto: any) {
    return this.service.findDealsByUserAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createDealsDto: CreateDealsDto, @Req() req: Request) {
    const deal = await this.service.create(
      {
        hours: +createDealsDto.hours,
        start_date: createDealsDto.start_date,
        end_date: createDealsDto.end_date,
        total_price: +req["total_price"],
        used: 0,
        total_used: +createDealsDto.hours,
        remaining: +createDealsDto.hours,
        status: createDealsDto.status,
        price_hour: +createDealsDto.price_hour,
        payment_method: createDealsDto.payment_method,
        deposites: createDealsDto.deposites,
        room: req["room"],
        assignGeneralOffer: req["assignGeneralOffer"],
        individual: req["individual"],
        company: req["company"],
        studentActivity: req["studentActivity"],
        createdBy: req["createdBy"],
      } as CreateDealsDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );

    return deal;
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() update: UpdateDealsDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: update.id,
        hours: +update.hours,
        start_date: update.start_date,
        end_date: update.end_date,
        total_price: +req["total_price"],
        status: update.status,
        price_hour: +update.price_hour,
        payment_method: update.payment_method,
        deposites: update.deposites,
        room: req["room"],
        assignGeneralOffer: req["assignGeneralOffer"],
        individual: req["individual"],
        company: req["company"],
        studentActivity: req["studentActivity"],
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Patch("/change-payment-method")
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.UPDATE],
    },
  ])
  public changePaymentMethod(@Body() update: { id: number; payment_method: string }) {
    return this.service.changeStatus(update.id, update.payment_method, "payment_method", {
      id: true,
      payment_method: true,
    });
  }

  @Patch("/change-status")
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.UPDATE],
    },
  ])
  public changeStatus(@Body() update: { id: number; status: boolean }) {
    return this.service.changeStatus(update.id, update.status, "status", {
      id: true,
      status: true,
    });
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.DELETE],
    },
  ])
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }

  @Patch("/change-deposits")
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.UPDATE],
    },
  ])
  public async changeDeposits(@Body() update: { id: number; deposites: number }) {
    const existingRecord = await this.service.findOne(update.id, {
      id: true,
      deposites: true,
    });

    return this.service.update(
      {
        id: update.id,
        deposites: (+existingRecord.deposites || 0) + +update.deposites,
      },
      {
        id: true,
        deposites: true,
      },
    );
  }

  @Patch("/change-is-paid")
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.UPDATE],
    },
  ])
  public changeIsPaid(@Body() update: { id: number; is_paid: boolean }) {
    return this.service.changeStatus(update.id, update.is_paid, "is_paid", {
      id: true,
      is_paid: true,
    });
  }
}
