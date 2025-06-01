import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { AssignesMembershipService } from "./assignes-membership.service";
import { CreateAssignesMembershipDto } from "./dto/create-assignes-membership.dto";
import { UpdateAssignesMembershipDto } from "./dto/update-assignes-membership.dto";
@UseGuards(AuthorizationGuard)
@Controller("assignes-membership")
export class AssignesMembershipController implements SelectOptions, RelationOptions {
  constructor(private readonly service: AssignesMembershipService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      start_date: true,
      end_date: true,
      total_price: true,
      used: true,
      remaining: true,
      total_used: true,
      payment_method: true,
      status: true,
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
      memeberShip: {
        id: true,
      },
      deposites: {
        id: true,
        total_price: true,
      },
      shared: {
        id: true,
      },
      deskarea: {
        id: true,
      },
    };
  }

  @Post("/individual")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.AssignesMembership,
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
      resource: Resource.AssignesMembership,
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
      resource: Resource.AssignesMembership,
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
      resource: Resource.AssignesMembership,
      actions: [Permission.INDEX],
    },
  ])
  async findUserAssigneslAll(@Body() filterQueryDto: any) {
    return this.service.findAssignesByUser(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() create: CreateAssignesMembershipDto, @Req() req: Request) {
    return await this.service.create(
      {
        start_date: create.start_date,
        end_date: create.end_date,
        createdBy: req["createdBy"],
        assignGeneralOffer: req["assignGeneralOffer"],
        memeberShip: req["memberShip"],
        total_price: req["totalPrice"],
        used: 0,
        individual: req["individual"],
        company: req["company"],
        studentActivity: req["studentActivity"],
        remaining: +req["memberShip"].days,
        total_used: +req["memberShip"].days,
      } as CreateAssignesMembershipDto,
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
  async createDeposite(@Body() create: { membership_id: number }, @Req() req: Request) {
    return await this.service.update({
      id: create.membership_id,
      deposites: req["deposite"],
    });
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() update: UpdateAssignesMembershipDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: update.id,
        start_date: update.start_date,
        end_date: update.end_date,
        createdBy: req["createdBy"],
        assignGeneralOffer: req["assignGeneralOffer"],
        memeberShip: req["memberShip"],
        total_price: req["totalPrice"],
        individual: req["individual"],
        company: req["company"],
        studentActivity: req["studentActivity"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.DELETE],
    },
  ])
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }

  @Patch("/change-status")
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.UPDATE],
    },
  ])
  public changeStatus(@Body() update: { id: number; status: boolean }) {
    return this.service.changeStatus(update.id, update.status, "status", {
      id: true,
      status: true,
    });
  }

  @Patch("/change-payment-method")
  @Permissions([
    {
      resource: Resource.AssignesMembership,
      actions: [Permission.UPDATE],
    },
  ])
  public changePaymentMethod(@Body() update: { id: number; payment_method: string }) {
    return this.service.changeStatus(update.id, update.payment_method, "payment_method", {
      id: true,
      payment_method: true,
    });
  }
}
