import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "src/users/user.service";

@Injectable()
export class CreatedByMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const createdBy = req.headers["created-by-id"];

    if (!createdBy) {
      throw new BadRequestException("Missing created-by-id in headers");
    }

    const user = await this.userService.findOneById(+createdBy);

    if (!user) {
      throw new BadRequestException(`User with ID ${createdBy} not found`);
    }

    req["createdBy"] = user;

    next();
  }
}
