import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateExpensePlaceDto } from "./dto/create-expense-place.dto";
import { UpdateExpensePlaceDto } from "./dto/update-expense-place.dto";
import { ExpensesPlaceService } from "./expense-place.service";

@UseGuards(AuthorizationGuard)
@Controller("expenses-place")
export class ExpensesPlaceController implements SelectOptions, RelationOptions {
  constructor(private readonly service: ExpensesPlaceService) {}

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
      expensePlace: {
        id: true,
        name: true,
      },
    };
  }

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.ExpensesPlace,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.ExpensesPlace,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() create: CreateExpensePlaceDto, @Req() req: Request) {
    return await this.service.create(
      {
        expensePlace: req["expensePlace"],
        total: create.total,
        createdBy: req["createdBy"],
      } as CreateExpensePlaceDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.ExpensesPlace,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateExpensePlaceDto: UpdateExpensePlaceDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: updateExpensePlaceDto.id,
        expensePlace: req["expensePlace"],
        total: updateExpensePlaceDto.total,
        createdBy: req["createdBy"],
      } as UpdateExpensePlaceDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.ExpensesPlace,
      actions: [Permission.DELETE],
    },
  ])
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
