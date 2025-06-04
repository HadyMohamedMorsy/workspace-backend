import { Controller, Get, Post } from "@nestjs/common";
import { AttendService } from "./attend.service";

@Controller("attend")
export class AttendController {
  constructor(private readonly attendService: AttendService) {}

  @Get("/index")
  async findAll() {
    return this.attendService.findAll();
  }

  @Post("/store")
  async create() {
    return await this.attendService.create();
  }
}
