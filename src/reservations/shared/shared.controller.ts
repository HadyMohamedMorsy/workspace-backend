import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { UpdateDepositeDto } from "src/deposit/dto/update-deposites.dto";
import { Permission, Resource, TypeUser } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../../shared/decorators/permissions.decorator";
import { CreateSharedDto } from "./dto/create-shared.dto";
import { UpdateSharedDto } from "./dto/update-shared.dto";
import { SharedService } from "./shared.service";

@UseGuards(AuthorizationGuard)
@Controller("shared")
export class SharedController implements SelectOptions, RelationOptions {
  constructor(private readonly service: SharedService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      selected_day: true,
      start_hour: true,
      start_minute: true,
      start_time: true,
      end_hour: true,
      end_minute: true,
      end_time: true,
      total_price: true,
      status: true,
      created_at: true,
      updated_at: true,
      createdBy: true,
      updatedBy: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      individual: {
        id: true,
        name: true,
        whatsApp: true,
      },
      company: {
        id: true,
        phone: true,
        name: true,
      },
      studentActivity: {
        id: true,
        name: true,
        whatsApp: true,
      },
      user: {
        id: true,
        name: true,
        whatsApp: true,
      },
      createdBy: {
        id: true,
        name: true,
        whatsApp: true,
      },
    };
  }

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Shared,
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
      resource: Resource.Shared,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividualSharedAll(@Body() filterQueryDto: any) {
    return this.service.findSharedByIndividualAll(filterQueryDto);
  }

  @Post("/studentActivity")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentSharedAll(@Body() filterQueryDto: any) {
    return this.service.findSharedByStudentActivityAll(filterQueryDto);
  }

  @Post("/company")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanySharedAll(@Body() filterQueryDto: any) {
    return this.service.findSharedByComapnyAll(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.INDEX],
    },
  ])
  async findUserSharedAll(@Body() filterQueryDto: any) {
    return this.service.findSharedByUserAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createSharedDto: CreateSharedDto, @Req() req: Request) {
    const customerType = Object.keys(TypeUser).find(type => req[type]);
    return await this.service.create(
      {
        selected_day: createSharedDto.selected_day,
        start_hour: createSharedDto.start_hour,
        start_minute: createSharedDto.start_minute,
        start_time: createSharedDto.start_time,
        assignGeneralOffer: req["assignGeneralOffer"],
        [customerType]: req[customerType],
        createdBy: req["createdBy"],
      } as CreateSharedDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() update: UpdateSharedDto, @Req() req: Request) {
    const customerType = Object.keys(TypeUser).find(type => req[type]);
    return await this.service.update(
      {
        id: update.id,
        selected_day: update.selected_day,
        end_hour: update.end_hour,
        end_minute: update.end_minute,
        end_time: update.end_time,
        assignGeneralOffer: req["assignGeneralOffer"],
        [customerType]: req[customerType],
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Post("/store-deposit")
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.CREATE],
    },
  ])
  async createDeposit(
    @Body() create: UpdateDepositeDto & { shared_id: number },
    @Req() req: Request,
  ) {
    return await this.service.update({
      id: create.shared_id,
      deposites: req["deposite"],
    } as UpdateSharedDto);
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.DELETE],
    },
  ])
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
