import { Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { DeleteCacheInterceptor } from "src/shared/interceptor/caching-delete-response.interceptor";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { AttendService } from "./attend.service";

@Controller("attend")
export class AttendController {
  constructor(private readonly attendService: AttendService) {}

  @Get("/index")
  @UseInterceptors(CachingInterceptor)
  async findAll() {
    return this.attendService.findAll();
  }

  @Post("/store")
  @UseInterceptors(DeleteCacheInterceptor)
  async create() {
    return await this.attendService.create();
  }
}
