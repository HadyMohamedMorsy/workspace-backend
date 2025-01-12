import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { ListService } from "./list.service";
import { PERMISSIONS_TREE } from "./tree/permission";

@Controller("lists")
export class ListController {
  constructor(private readonly listsService: ListService) {}

  @Post("list")
  async getLists(@Body("keys") keys: string[], @Req() req: any) {
    const result = await this.listsService.getLists(keys, req["lang"]);
    return {
      data: result,
    };
  }
  @Get("permission-list-tree")
  async getPermissionsTree() {
    const result = await this.listsService.getPermissionTree(PERMISSIONS_TREE);
    return {
      data: result,
    };
  }
}
