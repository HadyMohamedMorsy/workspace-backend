import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CreateVacationDto } from "./dto/create-vacation.dto";
import { UpdateVacationDto } from "./dto/update-vacation.dto";
import { VacationService } from "./vacation.service";

@UseGuards(AuthorizationGuard)
@Controller("vacation")
export class VacationController {
  constructor(private readonly vacationService: VacationService) {}

  @Post("/index")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Vacation,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.vacationService.findAll(filterQueryDto);
  }

  @Post("/user")
  @HttpCode(200)
  @UseInterceptors(CachingInterceptor)
  @Permissions([
    {
      resource: Resource.Vacation,
      actions: [Permission.INDEX],
    },
  ])
  async findByUserAll(@Body() filterQueryDto: any) {
    return this.vacationService.findUserAll(filterQueryDto);
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Vacation,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createVacationDto: CreateVacationDto, @Req() req: Request) {
    const user = req["user"];
    const createdBy = req["createdBy"];
    const payload = { ...createVacationDto, user, createdBy };
    return await this.vacationService.create(payload);
  }

  @Post("/update")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Vacation,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateVacationDto: UpdateVacationDto, @Req() req: Request) {
    const user = req["user"];
    const createdBy = req["createdBy"];
    const payload = { ...updateVacationDto, user, createdBy };
    return await this.vacationService.update(payload);
  }

  @Delete("/delete")
  @UseInterceptors(DeleteCacheInterceptor)
  @Permissions([
    {
      resource: Resource.Vacation,
      actions: [Permission.DELETE],
    },
  ])
  async remove(@Body() bodyDelete: { id: number }) {
    return this.vacationService.remove(bodyDelete.id);
  }
}
