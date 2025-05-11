import { Body, Controller, Delete, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateVacationDto } from "./dto/create-vacation.dto";
import { UpdateVacationDto } from "./dto/update-vacation.dto";
import { VacationService } from "./vacation.service";

@UseGuards(AuthorizationGuard)
@Controller("vacation")
export class VacationController implements SelectOptions, RelationOptions {
  constructor(private readonly service: VacationService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      selected_day: true,
      note: true,
      created_at: true,
      updated_at: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
      user: {
        id: true,
        firstName: true,
        lastName: true,
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
      resource: Resource.Vacation,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Vacation,
      actions: [Permission.INDEX],
    },
  ])
  async findByUserAll(@Body() filterQueryDto: any) {
    return this.service.findUserAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Vacation,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createVacationDto: CreateVacationDto, @Req() req: Request) {
    return await this.service.create(
      {
        note: createVacationDto.note,
        user: req["assignToUser"],
        createdBy: req["createdBy"],
        selected_day: createVacationDto.selected_day,
      } as CreateVacationDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Vacation,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateVacationDto: UpdateVacationDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: updateVacationDto.id,
        note: updateVacationDto.note,
        selected_day: updateVacationDto.selected_day,
        user: req["assignToUser"],
        createdBy: req["createdBy"],
      } as UpdateVacationDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Vacation,
      actions: [Permission.DELETE],
    },
  ])
  public delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
