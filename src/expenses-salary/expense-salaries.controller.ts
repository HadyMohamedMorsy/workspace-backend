import { Body, Controller, Delete, Get, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateExpenseSalariesDto } from "./dto/create-expense-salaries.dto";
import { UpdateExpenseSalariesDto } from "./dto/update-expense-salaries.dto";
import { ExpensesSalariesService } from "./expense-salaries.service";

@UseGuards(AuthorizationGuard)
@Controller("salary")
export class ExpensesSalariesController implements SelectOptions, RelationOptions {
  constructor(private readonly service: ExpensesSalariesService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      name: true,
      sallary: true,
      net_sallary: true,
      annual: true,
      destination: true,
      incentives: true,
      rewards: true,
      discounts: true,
      type_sallary: true,
      created_at: true,
      updated_at: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      user: {
        id: true,
        firstName: true,
        lastName: true,
      },
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
      resource: Resource.ExpensesSalaries,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Get("/list-salaries")
  async findList() {
    return this.service.getList();
  }

  @Post("/show")
  @HttpCode(200)
  async show(@Body() filterQueryDto: any) {
    return this.service.findOne(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.ExpensesSalaries,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() create: CreateExpenseSalariesDto, @Req() req: Request) {
    return await this.service.create(
      {
        sallary: create.sallary,
        incentives: create.incentives,
        destination: create.destination,
        name: create.name,
        rewards: create.rewards,
        discounts: create.discounts,
        type_sallary: create.type_sallary,
        user: req["user"],
        net_sallary: req["net_sallary"],
        annual: req["annual"],
        createdBy: req["createdBy"],
      } as CreateExpenseSalariesDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.ExpensesSalaries,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() udpate: UpdateExpenseSalariesDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: udpate.id,
        name: udpate.name,
        sallary: udpate.sallary,
        destination: udpate.destination,
        incentives: udpate.incentives,
        rewards: udpate.rewards,
        discounts: udpate.discounts,
        type_sallary: udpate.type_sallary,
        user: req["user"],
        net_sallary: req["net_sallary"],
        annual: req["annual"],
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.ExpensesSalaries,
      actions: [Permission.DELETE],
    },
  ])
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
