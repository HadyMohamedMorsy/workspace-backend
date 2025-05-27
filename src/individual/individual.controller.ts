import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateIndividualDto } from "./dto/create-individual.dto";
import { UpdateIndividualDto } from "./dto/update-individual.dto";
import { IndividualService } from "./individual.service";

@UseGuards(AuthorizationGuard)
@Controller("individual")
export class IndividualController implements SelectOptions, RelationOptions {
  constructor(private readonly service: IndividualService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      name: true,
      number: true,
      whatsApp: true,
      individual_type: true,
      employed_job: true,
      freelancer_job: true,
      unviresty: true,
      college: true,
      nationality: true,
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
      assign_memberships: {
        id: true,
        status: true,
      },
      assignesPackages: {
        id: true,
        status: true,
      },
      orders: {
        id: true,
        type_order: true,
      },
    };
  }

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Individual,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/show")
  @HttpCode(200)
  async findOne(@Body() filterQueryDto: any) {
    return this.service.findOne(filterQueryDto);
  }

  @Post("/user")
  @Permissions([
    {
      resource: Resource.Individual,
      actions: [Permission.INDEX],
    },
  ])
  @HttpCode(200)
  async findByUserAll(@Body() filterQueryDto: any) {
    return this.service.findByUserAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Individual,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() create: CreateIndividualDto, @Req() req: Request) {
    return await this.service.create(
      {
        name: create.name,
        number: create.number,
        whatsApp: create.whatsApp,
        individual_type: create.individual_type,
        employed_job: create.employed_job,
        freelancer_job: create.freelancer_job,
        unviresty: create.unviresty,
        college: create.college,
        nationality: create.nationality,
        note: create.note,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Individual,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() update: UpdateIndividualDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: update.id,
        name: update.name,
        number: update.number,
        whatsApp: update.whatsApp,
        individual_type: update.individual_type,
        employed_job: update.employed_job,
        freelancer_job: update.freelancer_job,
        unviresty: update.unviresty,
        college: update.college,
        nationality: update.nationality,
        note: update.note,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Individual,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }) {
    return this.service.delete(bodyDelete.id);
  }
}
