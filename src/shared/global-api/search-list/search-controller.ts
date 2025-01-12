import { Body, Controller, Post } from "@nestjs/common";
import { SearchService } from "./search-list.service";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post("list")
  async search(@Body() payload: { module: string; query: string }) {
    const { module, query } = payload;
    return this.searchService.search(module, query);
  }
}
