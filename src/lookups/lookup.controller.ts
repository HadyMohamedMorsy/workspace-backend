import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
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
import { CreateLookupDto } from "./dto/create-lookup.dto";
import { UpdateLookupDto } from "./dto/update-lookup.dto";
import { LookupService } from "./lookup.service";

@UseGuards(AuthorizationGuard)
@Controller("lookup")
export class LookupController implements SelectOptions, RelationOptions {
  constructor(private readonly service: LookupService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      name: true,
      module: true,
      created_at: true,
      updated_at: true,
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
      resource: Resource.Lookup,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Lookup,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createLookupDto: CreateLookupDto, @Req() req: Request) {
    return await this.service.create(
      {
        name: createLookupDto.name,
        parent: req["parent"] || null,
        createdBy: req["createdBy"],
        module: req["parent"] ? null : createLookupDto.module,
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Lookup,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateLookupDto: UpdateLookupDto, @Req() req: Request) {
    return await this.service.update(
      {
        id: updateLookupDto.id,
        name: updateLookupDto.name,
        parent: req["parent"] || null,
        createdBy: req["createdBy"],
        module: req["parent"] ? null : updateLookupDto.module,
      },
      this.selectOptions(),
      this.getRelationOptions(),
    );
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Lookup,
      actions: [Permission.DELETE],
    },
  ])
  async delete(@Body() id: number) {
    return this.service.delete(id);
  }

  @Get("/parents")
  @Permissions([
    {
      resource: Resource.Lookup,
      actions: [Permission.INDEX],
    },
  ])
  async getParents(@Query("module") module?: string) {
    return this.service.getParents(module as any);
  }

  @Get("/children/:parentId")
  @Permissions([
    {
      resource: Resource.Lookup,
      actions: [Permission.INDEX],
    },
  ])
  async getChildrenByParentId(@Param("parentId") parentId: string) {
    return this.service.getChildrenByParentId(+parentId);
  }

  @Patch("/change-status")
  @Permissions([
    {
      resource: Resource.Lookup,
      actions: [Permission.UPDATE],
    },
  ])
  public changeStatus(@Body() update: { id: number; is_parent: boolean }) {
    return this.service.changeStatus(update.id, update.is_parent, "is_parent", {
      id: true,
      is_parent: true,
    });
  }
}
