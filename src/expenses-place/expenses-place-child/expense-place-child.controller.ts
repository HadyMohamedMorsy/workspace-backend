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
      payment_method: true,
      featured_image: true,
      note: true,
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
      expensePlaceChild: {
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

  @Post("/all")
  @HttpCode(200)
  async findAllExpensesPlaceChild(@Body() filterQueryDto: any) {
    return this.service.findExpensesPlaceChildAll(filterQueryDto);
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
        note: create.note,
        expensePlaceChild: req["expensePlaceChild"],
        expensePlace: req["expensePlace"],
        payment_method: create.payment_method,
        featured_image: create.featured_image,
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
        note: update.note,
        expensePlaceChild: req["expensePlaceChild"],
        expensePlace: req["expensePlace"],
        payment_method: update.payment_method,
        featured_image: update.featured_image,
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
  async delete(@Body() { id }: { id: number }) {
    return this.service.delete(id);
  }

  @Patch("/change-payment-method")
  @Permissions([
    {
      resource: Resource.ExpensesPlace,
      actions: [Permission.UPDATE],
    },
  ])
  async changePaymentMethod(@Body() update: { id: number; payment_method: string }) {
    return this.service.changeStatus(update.id, update.payment_method, "payment_method", {
      id: true,
      payment_method: true,
    });
  }
}
