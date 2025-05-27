import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "src/users/user.service";

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers["user-id"];

    if (!userId) {
      throw new BadRequestException("Missing user-id in headers");
    }

    const user = await this.userService.findOne(+userId, {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
    });
    if (!user) {
      throw new BadRequestException(`User with ID ${userId} not found`);
    }

    req["createdBy"] = user;
    req["userData"] = user;

    next();
  }
}
