// controllers/product.controller.ts

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
import { GeneralSettingsService } from "src/general-settings/settings.service";
import { Permission, ReservationStatus, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@UseGuards(AuthorizationGuard)
@Controller("company")
export class CompanyController implements SelectOptions, RelationOptions {
  constructor(
    private readonly service: CompanyService,
    private readonly generalSettingsService: GeneralSettingsService,
  ) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      name: true,
      email: true,
      phone: true,
      whatsApp: true,
      website: true,
      facebook: true,
      instagram: true,
      linkedin: true,
      holders: true,
      note: true,
      featured_image: true,
      address: true,
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
      city: {
        id: true,
        name: true,
      },
      nationality: {
        id: true,
        name: true,
      },
      company_type: {
        id: true,
        name: true,
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
      resource: Resource.Company,
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
      resource: Resource.Company,
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
          deposites: true,
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
          },
          deposites: true,
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
          deposites: true,
        },
      },
      undefined,
      { status: ReservationStatus.ACTIVE },
    );
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Company,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createCompanyDto: CreateCompanyDto, @Req() req: Request) {
    return await this.service.create(
      {
        name: createCompanyDto.name,
        phone: createCompanyDto.phone,
        city: req["city"],
        company_type: req["company"],
        address: createCompanyDto.address,
        nationality: req["nationality"],
        email: createCompanyDto.email,
        featured_image: createCompanyDto.featured_image,
        holders: createCompanyDto.holders,
        note: createCompanyDto.note,
        whatsApp: createCompanyDto.whatsApp,
        facebook: createCompanyDto.facebook,
        website: createCompanyDto.website,
        instagram: createCompanyDto.instagram,
        linkedin: createCompanyDto.linkedin,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Company,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() update: UpdateCompanyDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: update.id,
        name: update.name,
        phone: update.phone,
        city: req["city"],
        company_type: req["company"],
        address: update.address,
        nationality: req["nationality"],
        email: update.email,
        featured_image: update.featured_image,
        holders: update.holders,
        note: update.note,
        whatsApp: update.whatsApp,
        facebook: update.facebook,
        website: update.website,
        instagram: update.instagram,
        linkedin: update.linkedin,
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Company,
      actions: [Permission.DELETE],
    },
  ])
  async delete(@Body() id: number) {
    return this.service.delete(id);
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
      resource: Resource.Company,
      actions: [Permission.IMPORT],
    },
  ])
  async importCompany(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    const createdBy = req["createdBy"];
    return this.service.importFromExcel(
      file.buffer,
      {
        requiredFields: [
          "name",
          "phone",
          "city",
          "company_type",
          "nationality",
          "email",
          "whatsApp",
        ],
        fieldMappings: {
          Name: "name",
          Phone: "phone",
          City: "city",
          "Company Type": "company_type",
          Nationality: "nationality",
          Email: "email",
          WhatsApp: "whatsApp",
        },
        findKey: "phone",
      },
      createdBy,
    );
  }
}
