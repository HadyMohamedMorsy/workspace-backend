import { Body, Controller, Delete, HttpCode, Post, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource, TypeUser } from "src/shared/enum/global-enum";
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
      name: true,
      start_date: true,
      end_date: true,
      total_price: true,
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
        name: true,
        price: true,
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
        status: true,
        payment_method: true,
      },
      room: {
        id: true,
        name: true,
        price: true,
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
    const customerType = Object.keys(TypeUser).find(type => req[type]);
    return await this.service.create(
      {
        createdBy: req["createdBy"],
        assignGeneralOffer: req["assignGeneralOffer"],
        packages: req["packages"],
        total_price: req["totalPrice"],
        used: 0,
        [customerType]: req[customerType],
        remaining: +req["packages"].hours,
        total_used: +req["packages"].hours,
        start_date: create.start_date,
        end_date: create.end_date,
      } as CreateAssignesPackageDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Post("/store-deposite")
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
    const customerType = Object.keys(TypeUser).find(type => req[type]);
    return await this.service.update(
      {
        id: update.id,
        start_date: update.start_date,
        end_date: update.end_date,
        createdBy: req["createdBy"],
        assignGeneralOffer: req["assignGeneralOffer"],
        packages: req["packages"],
        total_price: req["totalPrice"],
        [customerType]: req[customerType],
        remaining: +req["packages"].hours,
        total_used: +req["packages"].hours,
        used: update.used,
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
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
