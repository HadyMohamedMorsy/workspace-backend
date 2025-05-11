import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreatePurchaseDto } from "./dto/create-purchase.dto";
import { UpdatePurchaseDto } from "./dto/update-purchase.dto";
import { PurchaseService } from "./purchase.service";

@UseGuards(AuthorizationGuard)
@Controller("purchase")
export class PurchaseController implements SelectOptions, RelationOptions {
  constructor(private readonly service: PurchaseService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      type_store: true,
      weight_kg: true,
      weight_g: true,
      weight_product: true,
      purchase_price: true,
      total: true,
      purchase_qty: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
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
      resource: Resource.Purchases,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Purchases,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createPurchaseDto: CreatePurchaseDto, @Req() req: Request) {
    return await this.service.create({
      type_store: createPurchaseDto.type_store,
      weight_kg: createPurchaseDto.weight_kg,
      weight_g: createPurchaseDto.weight_g,
      weight_product: createPurchaseDto.weight_product,
      total: createPurchaseDto.total,
      purchase_qty: createPurchaseDto.purchase_qty,
      note: createPurchaseDto.note,
      product: req["product"],
      purchase_price: req["purchase_price"],
      createdBy: req["createdBy"],
    } as CreatePurchaseDto);
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Purchases,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updatePurchaseDto: UpdatePurchaseDto, @Req() req: Request) {
    return await this.service.update({
      id: updatePurchaseDto.id,
      type_store: updatePurchaseDto.type_store,
      weight_kg: updatePurchaseDto.weight_kg,
      weight_g: updatePurchaseDto.weight_g,
      weight_product: updatePurchaseDto.weight_product,
      total: updatePurchaseDto.total,
      purchase_qty: updatePurchaseDto.purchase_qty,
      note: updatePurchaseDto.note,
      purchase_price: req["purchase_price"],
      product: req["product"],
      createdBy: req["createdBy"],
    } as UpdatePurchaseDto);
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Purchases,
      actions: [Permission.DELETE],
    },
  ])
  public delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
