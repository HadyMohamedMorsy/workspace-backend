import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateReturnsDto } from "./dto/create-returns.dto";
import { UpdateReturnsDto } from "./dto/update-returns.dto";
import { ReturnsService } from "./returns.service";

@UseGuards(AuthorizationGuard)
@Controller("returns")
export class ReturnsController implements SelectOptions, RelationOptions {
  constructor(private readonly service: ReturnsService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      type_store: true,
      weight_kg: true,
      weight_g: true,
      weight_product: true,
      return_price: true,
      total: true,
      return_qty: true,
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
      resource: Resource.Returns,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Returns,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createReturnsDto: CreateReturnsDto, @Req() req: Request) {
    await this.service.create({
      type_store: createReturnsDto.type_store,
      weight_kg: createReturnsDto.weight_kg,
      weight_g: createReturnsDto.weight_g,
      weight_product: createReturnsDto.weight_product,
      total: createReturnsDto.total,
      return_qty: createReturnsDto.return_qty,
      note: createReturnsDto.note,
      product: req["product"],
      return_price: req["return_price"],
      createdBy: req["createdBy"],
    } as CreateReturnsDto);

    return req["product"];
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Returns,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateReturnsDto: UpdateReturnsDto, @Req() req: Request) {
    return await this.service.update({
      id: updateReturnsDto.id,
      type_store: updateReturnsDto.type_store,
      weight_kg: updateReturnsDto.weight_kg,
      weight_g: updateReturnsDto.weight_g,
      weight_product: updateReturnsDto.weight_product,
      total: updateReturnsDto.total,
      return_qty: updateReturnsDto.return_qty,
      note: updateReturnsDto.note,
      return_price: req["return_price"],
      product: req["product"],
      createdBy: req["createdBy"],
    } as UpdateReturnsDto);
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Returns,
      actions: [Permission.DELETE],
    },
  ])
  public delete(@Body() { id }: { id: number }) {
    return this.service.delete(id);
  }
}
