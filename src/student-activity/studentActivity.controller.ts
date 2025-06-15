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
  UseGuards,
} from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, ReservationStatus, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateStudentActivityDto } from "./dto/create-StudentActivity.dto";
import { UpdateStudentActivityDto } from "./dto/update-StudentActivity.dto";
import { StudentActivityService } from "./studentActivity.service";

@UseGuards(AuthorizationGuard)
@Controller("student-activity")
export class StudentActivityController implements SelectOptions, RelationOptions {
  constructor(private readonly service: StudentActivityService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      name: true,
      email: true,
      phone: true,
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
      resource: Resource.StudentActivity,
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

  @Post("/user")
  @Permissions([
    {
      resource: Resource.StudentActivity,
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
      resource: Resource.StudentActivity,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() create: CreateStudentActivityDto, @Req() req: Request) {
    return this.service.create({
      name: create.name,
      unviresty: create.unviresty,
      college: create.college,
      subjects: create.subjects,
      holders: create.holders,
      createdBy: req["createdBy"],
    });
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.StudentActivity,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() update: UpdateStudentActivityDto, @Req() req: Request) {
    return this.service.update({
      id: update.id,
      name: update.name,
      unviresty: update.unviresty,
      college: update.college,
      subjects: update.subjects,
      holders: update.holders,
      createdBy: req["createdBy"],
    });
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.StudentActivity,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() id: number) {
    return this.service.delete(id);
  }
}
