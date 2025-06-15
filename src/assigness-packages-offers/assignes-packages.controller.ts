import { Body, Controller, Delete, HttpCode, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { DepositeService } from "src/deposit/deposites.service";
import { CreateDepositeDto } from "src/deposit/dto/create-deposites.dto";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { AssignesPackagesService } from "./assignes-packages.service";
import { CreateAssignesPackageDto } from "./dto/create-assignes-packages.dto";
import { UpdateAssignesPackageDto } from "./dto/update-assignes-packages.dto";

@UseGuards(AuthorizationGuard)
@Controller("assignes-package")
export class AssignesPackageController implements SelectOptions, RelationOptions {
  constructor(
    private readonly service: AssignesPackagesService,
    private readonly depositeService: DepositeService,
  ) {}

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
      deposites: {
        id: true,
        total_price: true,
      },
      reservationRooms: {
        id: true,
      },
    };
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
      } as CreateAssignesPackageDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );

    if (create.start_deposite) {
      const deposite = await this.depositeService.create({
        total_price: create.start_deposite,
        assignPackage: assignPackage,
      } as CreateDepositeDto);

      await this.service.update({
        id: assignPackage.id,
        deposites: deposite,
      });
    }

    return assignPackage;
  }

  @Post("/deposit")
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.CREATE],
    },
  ])
  async createDeposite(@Body() create: { package_id: number }, @Req() req: Request) {
    return await this.service.update({
      id: create.package_id,
      deposites: req["deposite"],
    });
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
}
