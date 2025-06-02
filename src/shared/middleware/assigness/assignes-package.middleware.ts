import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AssignesPackagesService } from "src/assigness-packages-offers/assignes-packages.service";

@Injectable()
export class AssignesPackageMiddleware implements NestMiddleware {
  constructor(private readonly assignesPackageService: AssignesPackagesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const id = req.body.package_id;
    if (id) {
      const assignesPackage = await this.assignesPackageService.findOne(id, {
        id: true,
        remaining: true,
        total_used: true,
        used: true,
      });
      req["assignPackage"] = assignesPackage;
    }
    next();
  }
}
