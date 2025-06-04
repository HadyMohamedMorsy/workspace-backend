import { Body, Controller, Delete, Get, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateOfferPackagesDto } from "./dto/create-offer-packages.dto";
import { UpdateOfferPackagesDto } from "./dto/update-offer-packages.dto";
import { OfferPackagesService } from "./offerpackages.service";

@UseGuards(AuthorizationGuard)
@Controller("packages")
export class OfferPackagesController implements SelectOptions, RelationOptions {
  constructor(private readonly service: OfferPackagesService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      name: true,
      hours: true,
      price: true,
      created_at: true,
      updated_at: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      room: {
        id: true,
        name: true,
        capacity: true,
        price: true,
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
      resource: Resource.OfferPackages,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Get("/list-packages")
  async findList() {
    return this.service.getList();
  }

  @Post("/show")
  @HttpCode(200)
  async findRelList(@Body() filterQueryDto: any) {
    return this.service.findOne(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.OfferPackages,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() create: CreateOfferPackagesDto, @Req() req: Request) {
    return await this.service.create(
      {
        name: create.name,
        hours: create.hours,
        price: create.price,
        room: req["room"],
        createdBy: req["createdBy"],
      } as CreateOfferPackagesDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.OfferPackages,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() update: UpdateOfferPackagesDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: update.id,
        name: update.name,
        hours: update.hours,
        price: update.price,
        room: req["room"],
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.OfferPackages,
      actions: [Permission.DELETE],
    },
  ])
  async delete(@Body() id: number) {
    await this.service.delete(id);
    return;
  }
}
