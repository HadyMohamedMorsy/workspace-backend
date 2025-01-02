import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { NoFilesInterceptor } from "@nestjs/platform-express";
import { Auth } from "src/auth/decorators/auth.decorator";
import { AuthType } from "src/auth/enums/auth-type.enum";
import { CreateUserDto } from "./dtos/create-user.dto";
import { PatchUserDto } from "./dtos/patch-user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("user")
  @HttpCode(200)
  @Auth(AuthType.None)
  public getUser(@Query("email") email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Post("/index")
  @HttpCode(200)
  public index(@Body() filterQueryDto: any) {
    return this.userService.findAll(filterQueryDto);
  }

  @Post("/signup")
  @UseInterceptors(NoFilesInterceptor())
  @Auth(AuthType.None)
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post("/update")
  @UseInterceptors(NoFilesInterceptor())
  public async updateUsers(@Body() updateProductDto: PatchUserDto) {
    return await this.userService.updateUser(updateProductDto);
  }

  @Delete("/delete")
  @UseInterceptors(NoFilesInterceptor())
  public delete(@Body() id: number) {
    return this.userService.delete(id);
  }
}
