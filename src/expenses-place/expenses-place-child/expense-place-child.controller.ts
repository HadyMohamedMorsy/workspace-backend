import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../../shared/decorators/permissions.decorator";
import { CreateExpensePlaceChildDto } from "./dto/create-expense-place-child.dto";
import { UpdateExpensePlaceChildDto } from "./dto/update-expense-place-child.dto";
import { ExpensesPlaceChildService } from "./expense-place-child.service";

@UseGuards(AuthorizationGuard)
@Controller("expenses-child-place")
export class ExpensesPlaceChildController implements SelectOptions, RelationOptions {
  constructor(private readonly service: ExpensesPlaceChildService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      cost: true,
      featured_image: true,
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
  async create(@Body() create: CreateExpensePlaceChildDto, @Req() req: Request) {
    return await this.service.create(
      {
        cost: create.cost,
        featured_image: create.featured_image,
        expensePlace: req["expensePlace"],
        createdBy: req["createdBy"],
      } as CreateExpensePlaceChildDto,
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
  async update(@Body() update: UpdateExpensePlaceChildDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: update.id,
        cost: update.cost,
        featured_image: update.featured_image,
        expensePlace: req["expensePlace"],
        createdBy: req["createdBy"],
      },
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
