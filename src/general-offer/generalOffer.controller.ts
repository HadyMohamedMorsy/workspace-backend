import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateGeneralOfferDto } from "./dto/create-general-offer.dto";
import { UpdateGeneralOfferDto } from "./dto/update-general-offer.dto";
import { GeneralOfferService } from "./generalOffer.service";

@UseGuards(AuthorizationGuard)
@Controller("general-offer")
export class GeneralOfferController implements SelectOptions, RelationOptions {
  constructor(private readonly service: GeneralOfferService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      name: true,
      product: true,
      start_date: true,
      end_date: true,
      type_discount: true,
      discount: true,
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
    };
  }

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.GeneralOffer,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.GeneralOffer,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() create: CreateGeneralOfferDto, @Req() req: Request) {
    return await this.service.create(
      {
        name: create.name,
        product: create.product,
        start_date: create.start_date,
        end_date: create.end_date,
        type_discount: create.type_discount,
        discount: create.discount,
        createdBy: req["createdBy"],
      } as CreateGeneralOfferDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.GeneralOffer,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() update: UpdateGeneralOfferDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: update.id,
        name: update.name,
        product: update.product,
        start_date: update.start_date,
        end_date: update.end_date,
        type_discount: update.type_discount,
        discount: update.discount,
        createdBy: req["createdBy"],
      } as UpdateGeneralOfferDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.GeneralOffer,
      actions: [Permission.DELETE],
    },
  ])
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
