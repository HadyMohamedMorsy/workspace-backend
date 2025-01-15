import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Resource } from "src/auth/enums/auth-type.enum";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { ClearCacheAnotherModule } from "src/shared/decorators/clear-cache.decorator";
import { EntityName } from "src/shared/decorators/entity-name.decorator";
import { ClearCacheAnotherModuleInterceptor } from "src/shared/interceptor/caching-delete-antoher-modeule.interceptor";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { EntityIsExistInterceptor } from "src/shared/interceptor/entity-isexist.interceptor";
import { Permission } from "src/users/enum/permissions-enum";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateUserDto } from "./dtos/create-user.dto";
import { PatchUserDto } from "./dtos/patch-user.dto";
import { UserService } from "./user.service";

@UseGuards(AuthorizationGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.User,
      actions: [Permission.INDEX],
    },
  ])
  public index(@Body() filterQueryDto: any) {
    return this.userService.findAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.User,
      actions: [Permission.CREATE],
    },
  ])
  public createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post("/update")
  @ClearCacheAnotherModule("/api/v1/lists")
  @EntityName("user")
  @UseInterceptors(
    DeleteCacheInterceptor,
    EntityIsExistInterceptor,
    ClearCacheAnotherModuleInterceptor,
  )
  @Permissions([
    {
      resource: Resource.User,
      actions: [Permission.UPDATE],
    },
  ])
  public async updateUsers(@Body() updateProductDto: PatchUserDto) {
    return await this.userService.updateUser(updateProductDto);
  }

  @Delete("/delete")
  @ClearCacheAnotherModule("/api/v1/lists")
  @EntityName("user")
  @UseInterceptors(
    DeleteCacheInterceptor,
    EntityIsExistInterceptor,
    ClearCacheAnotherModuleInterceptor,
  )
  @Permissions([
    {
      resource: Resource.User,
      actions: [Permission.DELETE],
    },
  ])
  public delete(@Body() id: number) {
    return this.userService.delete(id);
  }
}
