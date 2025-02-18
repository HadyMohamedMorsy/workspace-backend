import { Body, Controller, Get, Post, Req, UseInterceptors } from "@nestjs/common";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { ListService } from "./list.service";
import { PERMISSIONS_TREE } from "./tree/permission";

@Controller("lists")
export class ListController {
  constructor(private readonly listsService: ListService) {}

  @Post("/list")
  async getLists(@Body("keys") keys: string[], @Req() req: any) {
    const result = await this.listsService.getLists(keys, req["lang"]);
    return {
      data: result,
    };
  }
  @Post("/list-entity")
  @UseInterceptors(CachingInterceptor)
  async getEntityLists(@Body() body: { module: string }) {
    return await this.listsService.getEntityList(body.module);
  }

  @Get("/permission-list-tree")
  @UseInterceptors(CachingInterceptor)
  async getPermissionsTree() {
    const result = await this.listsService.getPermissionTree(PERMISSIONS_TREE);
    return {
      data: result,
    };
  }

  @Get("/rooms-filters-calender")
  @UseInterceptors(CachingInterceptor)
  async roomsCalender() {
    const result = await this.listsService.filterRoomsCalender();
    return {
      data: result,
    };
  }
}
