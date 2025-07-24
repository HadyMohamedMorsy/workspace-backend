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
import { Permissions } from "../../shared/decorators/permissions.decorator";
import { formatDate, getCurrentTime } from "../helpers/utitlties";
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
    const createTime = getCurrentTime();

    return await this.service.create(
      {
        selected_day: formatDate(createSharedDto.selected_day),
        start_hour: createTime.hours,
        start_minute: createTime.minutes,
        start_time: createTime.timeOfDay,
        note: createSharedDto.note,
        is_full_day: createSharedDto.is_full_day,
        assignGeneralOffer: req["assignGeneralOffer"],
        assignessMemebership: req["assignMembership"],
        individual: req["individual"],
        company: req["company"],
        studentActivity: req["studentActivity"],
        createdBy: req["createdBy"],
      } as CreateSharedDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Patch("/change-payment-method")
  @Permissions([
    {
      resource: Resource.Shared,
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
      resource: Resource.Shared,
      actions: [Permission.UPDATE],
    },
  ])
  public changeStatus(@Body() update: { id: number; status: boolean }) {
    return this.service.changeStatus(update.id, update.status, "status", {
      id: true,
      status: true,
    });
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() update: UpdateSharedDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: update.id,
        selected_day: formatDate(update.selected_day),
        is_full_day: update.is_full_day,
        note: update.note,
        end_hour: update.end_hour,
        end_minute: update.end_minute,
        end_time: update.end_time,
        assignGeneralOffer: req["assignGeneralOffer"],
        assignessMemebership: req["assignMembership"],
        individual: req["individual"],
        company: req["company"],
        studentActivity: req["studentActivity"],
        createdBy: req["createdBy"],
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
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

  @Post("/membership")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Shared,
      actions: [Permission.INDEX],
    },
  ])
  async findMembershipSharedAll(@Body() filterQueryDto: any) {
    return this.service.findSharedByMembershipAll(filterQueryDto);
  }
}
