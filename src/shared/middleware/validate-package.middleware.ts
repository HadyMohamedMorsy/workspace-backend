import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { OfferPackagesService } from "src/offer-packages/offerpackages.service";

@Injectable()
export class ValidatePackageMiddleware implements NestMiddleware {
  constructor(private readonly packageService: OfferPackagesService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { body } = req;

    if (body.package_id) {
      const pkg = await this.validatePackage(body.package_id);
      req["package"] = pkg;
    }

    next();
  }

  private async validatePackage(id: number) {
    const pkg = await this.packageService.findOne(id);
    if (!pkg) {
      throw new BadRequestException("Invalid package");
    }
    return pkg;
  }
}
