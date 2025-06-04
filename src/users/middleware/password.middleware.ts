import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcrypt";

@Injectable()
export class PasswordMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.body?.password) {
      const salt = await bcrypt.genSalt(10);
      req["password"] = await bcrypt.hash(req.body.password, salt);
    }
    next();
  }
}
