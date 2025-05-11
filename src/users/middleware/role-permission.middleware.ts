import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { Role } from "src/shared/enum/global-enum";
import {
  ACCOUNTANT,
  COMMUNITY_OFFICER,
  FOUNDER,
  GENERALMANGER,
  OPERATIONMANGER,
  SALES,
  TECHNICALSUPPORT,
} from "../permissions-default";

@Injectable()
export class RolePermissionMiddleware implements NestMiddleware {
  private readonly rolePermissionsMap = {
    [Role.TECHNICAL_SUPPORT]: TECHNICALSUPPORT,
    [Role.FOUNDER]: FOUNDER,
    [Role.GENERAL_MANAGER]: GENERALMANGER,
    [Role.OPERATION_MANAGER]: OPERATIONMANGER,
    [Role.COMMUNITY_OFFICER]: COMMUNITY_OFFICER,
    [Role.ACCOUNTANT]: ACCOUNTANT,
    [Role.SALES]: SALES,
  };

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.body?.role) {
      req["permission"] = this.rolePermissionsMap[req.body.role] || null;
    }
    next();
  }
}
