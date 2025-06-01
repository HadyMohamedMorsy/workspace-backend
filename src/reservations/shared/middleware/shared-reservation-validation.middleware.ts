import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { Repository } from "typeorm";
import { Shared } from "../shared.entity";

@Injectable()
export class SharedReservationValidationMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Shared)
    private sharedRepository: Repository<Shared>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_type, customer_id } = req.body;
      const activeReservations = await this.getActiveReservations(customer_type, customer_id);
      if (activeReservations.length) {
        throw new BadRequestException("There is already an active reservation for this day");
      }
      next();
    } catch (error) {
      next(error);
    }
  }

  private async getActiveReservations(customerType: string, customerId: number): Promise<Shared[]> {
    return this.sharedRepository.find({
      relations: ["individual", "company", "studentActivity"],
      where: {
        status: ReservationStatus.ACTIVE,
        [customerType]: { id: customerId },
      },
    });
  }
}
