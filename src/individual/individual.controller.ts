import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, ReservationStatus, Resource } from "src/shared/enum/global-enum";
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
      nationality: {
        id: true,
        name: true,
      },
      college: {
        id: true,
        name: true,
      },
      unviresty: {
        id: true,
        name: true,
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

  @Get("/assignes-membership/:id")
  async assignesMembershipById(@Param("id") id: number) {
    return this.service.findOne(
      id,
      {
        id: true,
        name: true,
      },
      {
        assign_memberships: {
          id: true,
          status: true,
          start_date: true,
          end_date: true,
          used: true,
          total_used: true,
          remaining: true,
          total_price: true,
          payment_method: true,
          memeberShip: {
            id: true,
            name: true,
            type: true,
          },
          deposites: {
            id: true,
            total_price: true,
          },
        },
      },
      undefined,
      { status: ReservationStatus.ACTIVE },
    );
  }

  @Get("/assignes-package/:id")
  async assignesPackageById(@Param("id") id: number) {
    return this.service.findOne(
      id,
      {
        id: true,
        name: true,
      },
      {
        assignesPackages: {
          id: true,
          status: true,
          start_date: true,
          end_date: true,
          used: true,
          total_used: true,
          remaining: true,
          total_price: true,
          payment_method: true,
          packages: {
            id: true,
            name: true,
            room: {
              id: true,
              name: true,
            },
          },
          deposites: {
            id: true,
            total_price: true,
          },
        },
      },
      undefined,
      { status: ReservationStatus.ACTIVE },
    );
  }
  @Get("/assignes-deal/:id")
  async assignesDealById(@Param("id") id: number) {
    return this.service.findOne(
      id,
      {
        id: true,
        name: true,
      },
      {
        deals: {
          id: true,
          status: true,
          start_date: true,
          end_date: true,
          used: true,
          total_used: true,
          remaining: true,
          total_price: true,
          price_hour: true,
          hours: true,
          payment_method: true,
          room: {
            id: true,
            name: true,
          },
          deposites: {
            id: true,
            total_price: true,
          },
        },
      },
      undefined,
      { status: ReservationStatus.ACTIVE },
    );
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
        unviresty: req["unviresty"],
        college: req["college"],
        nationality: req["nationality"],
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
        unviresty: req["unviresty"],
        college: req["college"],
        nationality: req["nationality"],
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

  @Get("/check-invoice/:id")
  @HttpCode(200)
  async checkInvoice(@Param("id") id: string) {
    return this.service.checkInvoice(id);
  }

  @Post("/import")
  @HttpCode(200)
  @UseInterceptors(FileInterceptor("file"))
  @Permissions([
    {
      resource: Resource.Individual,
      actions: [Permission.IMPORT],
    },
  ])
  async importIndividuals(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const createdBy = req["createdBy"];
    return this.service.importFromExcel(
      file.buffer,
      {
        requiredFields: ["name", "number", "whatsApp", "individual_type", "nationality"],
        fieldMappings: {
          Name: "name",
          Number: "number",
          WhatsApp: "whatsApp",
          "Individual Type": "individual_type",
          Nationality: "nationality",
        },
        findKey: "number",
      },
      createdBy,
    );
  }
}
