import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { DealsService } from "./deals.service";
import { CreateDealsDto } from "./dto/create-deals.dto";
import { UpdateDealsDto } from "./dto/update-deals.dto";

@UseGuards(AuthorizationGuard)
@Controller("deals")
export class DealsController {
  constructor(private readonly service: DealsService) {}

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
    return await this.service.create({
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
      room: req["room"],
      assignGeneralOffer: req["assignGeneralOffer"],
      individual: req["individual"],
      company: req["company"],
      studentActivity: req["studentActivity"],
      createdBy: req["createdBy"],
    } as CreateDealsDto);
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Deals,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() update: UpdateDealsDto, @Req() req: Request) {
    return await this.service.update({
      id: update.id,
      deposites: update.deposites,
      hours: +update.hours,
      start_date: update.start_date,
      end_date: update.end_date,
      total_price: +req["total_price"],
      status: update.status,
      price_hour: +update.price_hour,
      payment_method: update.payment_method,
      room: req["room"],
      assignGeneralOffer: req["assignGeneralOffer"],
      individual: req["individual"],
      company: req["company"],
      studentActivity: req["studentActivity"],
      createdBy: req["createdBy"],
    });
  }

  @Post("/store-deposit")
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.CREATE],
    },
  ])
  async createDeposite(@Body() createDealsDto: { deal_id: number }, @Req() req: Request) {
    return await this.service.update({
      id: createDealsDto.deal_id,
      deposites: req["deposite"],
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
}
