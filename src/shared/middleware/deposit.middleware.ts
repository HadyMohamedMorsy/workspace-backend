import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { DepositeService } from "src/deposit/deposites.service";
import { CreateDepositeDto } from "src/deposit/dto/create-deposites.dto";
import { Deskarea } from "src/reservations/deskarea/deskarea.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { Shared } from "src/reservations/shared/shared.entity";

interface DepositEntity extends CreateDepositeDto {
  assignMembership?: AssignesMembership;
  assignPackage?: AssignesPackages;
  reservationRoom?: ReservationRoom;
  shared?: Shared;
  deskarea?: Deskarea;
}

@Injectable()
export class DepositMiddleware implements NestMiddleware {
  constructor(private readonly depositeService: DepositeService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const entities = {
      memberShip: { type: "membership", field: "assignMembership" },
      pkg: { type: "package", field: "assignPackage" },
      shared: { type: "shared", field: "shared" },
      deskarea: { type: "deskarea", field: "deskarea" },
      reservationRoom: { type: "reservationRoom", field: "reservationRoom" },
    };

    for (const [key, config] of Object.entries(entities)) {
      const entity = req[key];
      if (entity) {
        const deposite = await this.createDeposit(req, entity, config.field);
        this.validateDepositAmount(deposite, entity, config.type);
        req["deposite"] = deposite;
        break;
      }
    }

    next();
  }

  private async createDeposit(req: Request, entity: any, assignField: string): Promise<any> {
    const depositData: DepositEntity = {
      total_price: req.body.total_price,
      status: req.body.status,
      [assignField]: entity,
      createdBy: req["createdBy"],
    };

    return this.depositeService.create(depositData);
  }

  private validateDepositAmount(deposite: any, entity: any, type: string): void {
    if (deposite.total_price >= entity.total_price) {
      throw new BadRequestException(
        `Deposit amount (${deposite.total_price}) must be less than ${type} total price (${entity.total_price})`,
      );
    }
  }
}
