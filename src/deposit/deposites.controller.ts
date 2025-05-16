import { Body, Controller, Delete, HttpCode, Post, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { DepositeService } from "./deposites.service";
import { UpdateDepositeDto } from "./dto/update-deposites.dto";

@UseGuards(AuthorizationGuard)
@Controller("deposite")
export class DepositesController {
  constructor(private readonly depositeService: DepositeService) {}

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.depositeService.findAll(filterQueryDto);
  }

  @Post("/update")
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateDepositeDto: UpdateDepositeDto) {
    return await this.depositeService.update(updateDepositeDto);
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Deposite,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }): Promise<void> {
    return this.depositeService.remove(bodyDelete.id);
  }
}
