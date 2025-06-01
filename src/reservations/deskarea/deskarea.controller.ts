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
import { UpdateDepositeDto } from "src/deposit/dto/update-deposites.dto";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../../shared/decorators/permissions.decorator";
import { formatDate, getCurrentTime } from "../helpers/utitlties";
import { DeskareaService } from "./deskarea.service";
import { CreateDeskAreaDto } from "./dto/create-deskarea.dto";
import { UpdateDeskAreaDto } from "./dto/update-deskarea.dto";

@UseGuards(AuthorizationGuard)
@Controller("deskarea")
export class DeskareaController implements SelectOptions, RelationOptions {
  constructor(private readonly service: DeskareaService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      selected_day: true,
      start_hour: true,
      start_minute: true,
      start_time: true,
      status: true,
      note: true,
      is_full_day: true,
      created_at: true,
      createdBy: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      individual: {
        id: true,
        name: true,
      },
      company: {
        id: true,
        name: true,
      },
      studentActivity: {
        id: true,
        name: true,
      },
      createdBy: {
        id: true,
        firstName: true,
        lastName: true,
      },
    };
  }
  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Deskarea,
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
      resource: Resource.Deskarea,
      actions: [Permission.INDEX],
    },
  ])
  async findIndividualDeskareaAll(@Body() filterQueryDto: any) {
    return this.service.findDeskareaByIndividualAll(filterQueryDto);
  }

  @Post("/studentActivity")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.INDEX],
    },
  ])
  async findStudentDeskareaAll(@Body() filterQueryDto: any) {
    return this.service.findDeskareaByStudentActivityAll(filterQueryDto);
  }

  @Post("/company")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.INDEX],
    },
  ])
  async findCompanyDeskareaAll(@Body() filterQueryDto: any) {
    return this.service.findDeskareaByCompanyAll(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.INDEX],
    },
  ])
  async findUserDeskareaAll(@Body() filterQueryDto: any) {
    return this.service.findDeskareaByUserAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createDeskareaDto: CreateDeskAreaDto, @Req() req: Request) {
    const createTime = getCurrentTime();

    return await this.service.create(
      {
        selected_day: formatDate(createDeskareaDto.selected_day),
        start_hour: createTime.hours,
        start_minute: createTime.minutes,
        start_time: createTime.timeOfDay,
        is_full_day: createDeskareaDto.is_full_day,
        note: createDeskareaDto.note,
        assignGeneralOffer: req["assignGeneralOffer"],
        individual: req["individual"],
        company: req["company"],
        studentActivity: req["studentActivity"],
        createdBy: req["createdBy"],
      } as CreateDeskAreaDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Patch("/change-payment-method")
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.UPDATE],
    },
  ])
  public changePaymentMethod(@Body() update: { id: number; payment_method: string }) {
    return this.service.changeStatus(update.id, update.payment_method, "payment_method", {
      id: true,
      payment_method: true,
    });
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() update: UpdateDeskAreaDto, @Req() req: Request) {
    const createTime = getCurrentTime();
    return await this.service.update(
      {
        id: update.id,
        selected_day: formatDate(update.selected_day),
        start_hour: createTime.hours,
        start_minute: createTime.minutes,
        start_time: createTime.timeOfDay,
        is_full_day: update.is_full_day,
        note: update.note,
        assignGeneralOffer: req["assignGeneralOffer"],
        individual: req["individual"],
        company: req["company"],
        studentActivity: req["studentActivity"],
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
    @Body() create: UpdateDepositeDto & { deskarea_id: number },
    @Req() req: Request,
  ) {
    return await this.service.update({
      id: create.deskarea_id,
      deposites: req["deposite"],
    } as UpdateDeskAreaDto);
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Deskarea,
      actions: [Permission.DELETE],
    },
  ])
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
