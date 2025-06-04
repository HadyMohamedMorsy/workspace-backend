import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Deals } from "src/deals/deals.entity";
import { Deposite } from "src/deposit/deposites.entity";
import { ExpensePlace } from "src/expenses-place/expense-place.entity";
import { ExpensePlaceChild } from "src/expenses-place/expenses-place-child/expense-place-child.entity";
import { ExpenseSalaries } from "src/expenses-salary/expense-salaries.entity";
import { Individual } from "src/individual/individual.entity";
import { Order } from "src/orders/order.entity";
import { Purchase } from "src/purchase/purchase.entity";
import { Deskarea } from "src/reservations/deskarea/deskarea.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { Shared } from "src/reservations/shared/shared.entity";
import { Returns } from "src/returns/returns.entity";
import { RevenueChild } from "src/revenue/revenue-child/revenue-child.entity";
import { Revenue } from "src/revenue/revenue.entity";
import { DahboredService } from "./dahsbored.service";
import { DashboredController } from "./dashbored.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Individual,
      ExpensePlaceChild,
      AssignesPackages,
      AssignesMembership,
      AssignGeneralOffer,
      Shared,
      Deposite,
      Deskarea,
      ReservationRoom,
      RevenueChild,
      Revenue,
      ExpensePlace,
      Deals,
      ExpenseSalaries,
      Purchase,
      Returns,
    ]),
  ],
  controllers: [DashboredController],
  providers: [DahboredService],
})
export class DashboredModule {}
