import { Body, Controller, Delete, HttpCode, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { AssignesPackagesService } from "./assignes-packages.service";
import { CreateAssignesPackageDto } from "./dto/create-assignes-packages.dto";
import { UpdateAssignesPackageDto } from "./dto/update-assignes-packages.dto";

@UseGuards(AuthorizationGuard)
@Controller("assignes-package")
export class AssignesPackageController implements SelectOptions, RelationOptions {
  constructor(private readonly service: AssignesPackagesService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      start_date: true,
      end_date: true,
      total_price: true,
      payment_method: true,
      remaining: true,
      status: true,
      total_used: true,
      used: true,
      deposites: true,
      is_paid: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      createdBy: {
        id: true,
        firstName: true,
        lastName: true,
      },
      assignGeneralOffer: {
        id: true,
      },
      packages: {
        id: true,
        name: true,
        price: true,
        hours: true,
      },
      reservationRooms: {
        id: true,
      },
    };
  }

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/individual")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividualAssigneslAll(@Body() filterQueryDto: any) {
    return this.service.findAssignesByIndividual(filterQueryDto);
  }

  @Post("/company")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanyAssigneslAll(@Body() filterQueryDto: any) {
    return this.service.findAssignesByCompany(filterQueryDto);
  }

  @Post("/studentActivity")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentActivityAssigneslAll(@Body() filterQueryDto: any) {
    return this.service.findAssignesByStudentActivity(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.INDEX],
    },
  ])
  async findUserAssigneslAll(@Body() filterQueryDto: any) {
    return this.service.findAssignesByUser(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() create: CreateAssignesPackageDto, @Req() req: Request) {
    const assignPackage = await this.service.create(
      {
        createdBy: req["createdBy"],
        assignGeneralOffer: req["assignGeneralOffer"],
        packages: req["package"],
        total_price: req["totalPrice"],
        used: 0,
        individual: req["individual"],
        company: req["company"],
        studentActivity: req["studentActivity"],
        remaining: +req["package"].hours,
        total_used: +req["package"].hours,
        start_date: create.start_date,
        end_date: create.end_date,
        deposites: create.deposites,
      } as CreateAssignesPackageDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );

    return assignPackage;
  }

  @Post("/update")
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() update: UpdateAssignesPackageDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: update.id,
        start_date: update.start_date,
        end_date: update.end_date,
        createdBy: req["createdBy"],
        assignGeneralOffer: req["assignGeneralOffer"],
        packages: req["package"],
        individual: req["individual"],
        company: req["company"],
        studentActivity: req["studentActivity"],
        total_price: req["totalPrice"],
        deposites: update.deposites,
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Patch("/change-payment-method")
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.UPDATE],
    },
  ])
  public changePaymentMethod(@Body() update: { id: number; payment_method: string }) {
    return this.service.changeStatus(update.id, update.payment_method, "payment_method", {
      id: true,
      payment_method: true,
    });
  }

  @Patch("/change-status")
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.UPDATE],
    },
  ])
  public changeStatus(@Body() update: { id: number; status: boolean }) {
    return this.service.changeStatus(update.id, update.status, "status", {
      id: true,
      status: true,
    });
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.DELETE],
    },
  ])
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }

  @Patch("/change-deposits")
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.UPDATE],
    },
  ])
  public async changeDeposits(@Body() update: { id: number; deposites: number }) {
    const existingRecord = await this.service.findOne(update.id, {
      id: true,
      deposites: true,
    });

    return this.service.update(
      {
        id: update.id,
        deposites: (+existingRecord.deposites || 0) + +update.deposites,
      },
      {
        id: true,
        deposites: true,
      },
    );
  }

  @Patch("/change-is-paid")
  @Permissions([
    {
      resource: Resource.AssignesPackage,
      actions: [Permission.UPDATE],
    },
  ])
  public changeIsPaid(@Body() update: { id: number; is_paid: boolean }) {
    return this.service.changeStatus(update.id, update.is_paid, "is_paid", {
      id: true,
      is_paid: true,
    });
  }
}
