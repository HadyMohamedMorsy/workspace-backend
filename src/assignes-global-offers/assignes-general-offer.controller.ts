import { Body, Controller, Delete, HttpCode, Post, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { AssignGeneralOfferservice } from "./assignes-general-offer.service";

@UseGuards(AuthorizationGuard)
@Controller("assign-general-offer")
export class AssignGeneralOfferController implements SelectOptions, RelationOptions {
  constructor(private readonly service: AssignGeneralOfferservice) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
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
      generalOffer: {
        id: true,
        name: true,
      },
      individual: {
        id: true,
        firstName: true,
        lastName: true,
      },
      company: {
        id: true,
        name: true,
      },
      studentActivity: {
        id: true,
        name: true,
      },
      shared: {
        id: true,
        name: true,
      },
      deskarea: {
        id: true,
        name: true,
      },
      reservationRooms: {
        id: true,
        name: true,
      },
    };
  }

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.AssignGeneralOffer,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAssignesByUser(filterQueryDto);
  }

  @Post("/all")
  @HttpCode(200)
  async findAllAssignes(@Body() filterQueryDto: any) {
    return this.service.findAssignesAll(filterQueryDto);
  }

  @Post("/show")
  @HttpCode(200)
  async findOne(@Body() filterQueryDto: any) {
    return this.service.findOne(filterQueryDto.id);
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.AssignGeneralOffer,
      actions: [Permission.DELETE],
    },
  ])
  public delete(@Body() id: number) {
    return this.service.delete(id);
  }

  @Post("/user")
  @HttpCode(200)
  async findByUser(@Body() filterQueryDto: any) {
    return this.service.findAssignesByUser(filterQueryDto);
  }

  @Post("/individual")
  @HttpCode(200)
  async findByIndividual(@Body() filterQueryDto: any) {
    return this.service.findAssignesByIndividual(filterQueryDto);
  }

  @Post("/company")
  @HttpCode(200)
  async findByCompany(@Body() filterQueryDto: any) {
    return this.service.findAssignesByCompany(filterQueryDto);
  }

  @Post("/studentActivity")
  @HttpCode(200)
  async findByStudentActivity(@Body() filterQueryDto: any) {
    return this.service.findAssignesByStudentActivity(filterQueryDto);
  }
}
