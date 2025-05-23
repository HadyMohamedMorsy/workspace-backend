import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { UserDto } from "./dtos/create-user.dto";
import { PatchUserDto } from "./dtos/patch-user.dto";
import { UserService } from "./user.service";

@UseGuards(AuthorizationGuard)
@Controller("user")
export class UserController implements SelectOptions, RelationOptions {
  constructor(private readonly service: UserService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      created_at: true,
      updated_at: true,
      firstName: true,
      lastName: true,
      email: true,
      username: true,
      phone: true,
      role: true,
      status: true,
      annual_start: true,
      annual_increase: true,
      permission: true,
    };
  }

  public getRelationOptions(): Record<string, any> {
    return {
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
      resource: Resource.User,
      actions: [Permission.INDEX],
    },
  ])
  public index(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Get("/permission")
  public permission(@Query("id") id: number) {
    return this.service.permission(id);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.User,
      actions: [Permission.CREATE],
    },
  ])
  public create(@Body() userDto: UserDto, @Req() req: Request) {
    return this.service.create(
      {
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        email: userDto.email,
        username: userDto.username,
        role: userDto.role,
        password: req["password"],
        phone: userDto.phone,
        annual_start: userDto.annual_start,
        annual_increase: userDto.annual_increase,
        permission: req["permission"],
        createdBy: req["createdBy"],
      } as UserDto,
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.User,
      actions: [Permission.UPDATE],
    },
  ])
  public async update(@Body() updateProductDto: PatchUserDto, @Req() req: Request) {
    const updateData: PatchUserDto = {
      id: updateProductDto.id,
      firstName: updateProductDto.firstName,
      lastName: updateProductDto.lastName,
      email: updateProductDto.email,
      username: updateProductDto.username,
      role: updateProductDto.role,
      phone: updateProductDto.phone,
      annual_start: updateProductDto.annual_start,
      status: updateProductDto.status,
      annual_increase: updateProductDto.annual_increase,
      permission: req["permission"],
      createdBy: req["createdBy"],
    };
    if (req["password"]) updateData.password = req["password"];
    if (req["permission"]) updateData.permission = req["permission"];

    return await this.service.update(updateData, this.selectOptions(), this.getRelationOptions());
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.User,
      actions: [Permission.DELETE],
    },
  ])
  public delete(@Body() id: number) {
    return this.service.delete(id);
  }

  @Patch("/change-status")
  @Permissions([
    {
      resource: Resource.User,
      actions: [Permission.UPDATE],
    },
  ])
  public changeStatus(@Body() update: { id: number; status: boolean }) {
    return this.service.changeStatus(update.id, update.status, "status", {
      id: true,
      status: true,
    });
  }
}
