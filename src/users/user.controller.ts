import { Body, Controller, Delete, HttpCode, Post, UseGuards } from "@nestjs/common";
import { Permissions } from "src/auth/decorators/permissions.decorator";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission } from "src/users/enum/permissions-enum";
import { CreateUserDto } from "./dtos/create-user.dto";
import { PatchUserDto } from "./dtos/patch-user.dto";
import { UserService } from "./user.service";

@UseGuards(AuthorizationGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/index")
  @HttpCode(200)
  @Permissions([
    {
      resource: "user",
      actions: [Permission.INDEX],
    },
  ])
  public index(@Body() filterQueryDto: any) {
    return this.userService.findAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: "user",
      actions: [Permission.CREATE],
    },
  ])
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post("/update")
  @Permissions([
    {
      resource: "user",
      actions: [Permission.UPDATE],
    },
  ])
  public async updateUsers(@Body() updateProductDto: PatchUserDto) {
    return await this.userService.updateUser(updateProductDto);
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: "user",
      actions: [Permission.DELETE],
    },
  ])
  public delete(@Body() id: number) {
    return this.userService.delete(id);
  }
}
