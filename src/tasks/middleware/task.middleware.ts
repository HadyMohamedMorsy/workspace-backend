import { Injectable, NestMiddleware, NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "src/users/user.service";
@Injectable()
export class TaskMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UserService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const { user_id } = req.body;

    const user = await this.usersService.findOne(user_id);
    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    req["assignToUser"] = user;

    next();
  }
}
