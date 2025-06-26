import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { LookupService } from "./lookup.service";

@Injectable()
export class LookupMiddleware implements NestMiddleware {
  constructor(private readonly lookupService: LookupService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { parentId } = req.body;

    if (parentId) {
      const parent = await this.lookupService.findOne(parentId, {
        id: true,
        name: true,
      });

      req["parent"] = parent;
    }

    next();
  }
}
