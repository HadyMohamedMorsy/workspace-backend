import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { DeskareaService } from "src/reservations/deskarea/deskarea.service";

@Injectable()
export class DeskareaMiddleware implements NestMiddleware {
  constructor(private readonly deskareaService: DeskareaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const id = req.body.deskarea_id;
    const deskarea = await this.deskareaService.findOne(id, { id: true });
    req["deskarea"] = deskarea;
    next();
  }
}
