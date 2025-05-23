import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateCoWorkingSpaceDto } from "./dto/create-offer-co-working-space.dto";
import { UpdateCoWorkingSpaceDto } from "./dto/update-offer-co-working-space.dto";
import { OfferCoWorkingSpaceService } from "./offer-co-working-space.service";

@UseGuards(AuthorizationGuard)
@Controller("offer-co-working-space")
export class OfferCoWorkingSpaceController implements SelectOptions, RelationOptions {
  constructor(private readonly service: OfferCoWorkingSpaceService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      name: true,
      price: true,
      days: true,
      type: true,
      created_at: true,
      updated_at: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      assignessMemebership: {
        id: true,
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
      resource: Resource.OfferWorkingSpace,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.OfferWorkingSpace,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createDto: CreateCoWorkingSpaceDto, @Req() req: Request) {
    return await this.service.create({
      name: createDto.name,
      price: createDto.price,
      days: createDto.days,
      type: createDto.type,
      createdBy: req["createdBy"],
    });
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.OfferWorkingSpace,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateDto: UpdateCoWorkingSpaceDto, @Req() req: Request) {
    return await this.service.update({
      id: updateDto.id,
      name: updateDto.name,
      price: updateDto.price,
      days: updateDto.days,
      type: updateDto.type,
      createdBy: req["createdBy"],
    });
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.OfferWorkingSpace,
      actions: [Permission.DELETE],
    },
  ])
  async delete(id: number) {
    return await this.service.delete(id);
  }
}
