import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
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
  async getEntityLists(@Body() body: { module: string }) {
    return await this.listsService.getEntityList(body.module);
  }

  @Get("/permission-list-tree")
  async getPermissionsTree() {
    const result = await this.listsService.getPermissionTree(PERMISSIONS_TREE);
    return {
      data: result,
    };
  }

  @Get("/rooms-filters-calender")
  async roomsCalender() {
    const result = await this.listsService.filterRoomsCalender();
    return {
      data: result,
    };
  }

  @Get("/lookups-child-list")
  async getLookupsChildList(@Query("parentId") parentId: string) {
    const result = await this.listsService.getLookupsChildList(+parentId);
    return {
      data: result,
    };
  }
}
