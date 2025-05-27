import { Body, Controller, Delete, Get, HttpCode, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "src/auth/guards/access-token/authroization.guard";
import { Permission, Resource } from "src/shared/enum/global-enum";
import { RelationOptions, SelectOptions } from "src/shared/interfaces/query.interface";
import { Permissions } from "../shared/decorators/permissions.decorator";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@UseGuards(AuthorizationGuard)
@Controller("category")
export class CategoryController implements SelectOptions, RelationOptions {
  constructor(private readonly service: CategoryService) {}

  public selectOptions(): Record<string, boolean> {
    return {
      id: true,
      name: true,
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
      resource: Resource.Category,
      actions: [Permission.INDEX],
    },
  ])
  async findAll(@Body() filterQueryDto: any) {
    return this.service.findAll(filterQueryDto);
  }

  @Get("/list-categories")
  async findList() {
    return this.service.getList({}, [], { name: true, id: true });
  }

  @Post("/store")
  @Permissions([
    {
      resource: Resource.Category,
      actions: [Permission.CREATE],
    },
  ])
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request) {
    return await this.service.create({
      name: createCategoryDto.name,
      createdBy: req["createdBy"],
    } as CreateCategoryDto);
  }

  @Put("/update")
  @Permissions([
    {
      resource: Resource.Category,
      actions: [Permission.UPDATE],
    },
  ])
  async update(@Body() updateCategoryDto: UpdateCategoryDto, @Req() req: Request) {
    return await this.service.update({
      id: updateCategoryDto.id,
      name: updateCategoryDto.name,
      createdBy: req["createdBy"],
    } as UpdateCategoryDto);
  }

  @Delete("/delete")
  @Permissions([
    {
      resource: Resource.Category,
      actions: [Permission.DELETE],
    },
  ])
  public delete(@Body() id: number) {
    return this.service.delete(id);
  }
}
