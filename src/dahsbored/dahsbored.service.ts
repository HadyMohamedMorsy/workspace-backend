import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Deals } from "src/deals/deals.entity";
import { ExpensePlace } from "src/expenses-place/expense-place.entity";
import { ExpensePlaceChild } from "src/expenses-place/expenses-place-child/expense-place-child.entity";
import { ExpenseSalaries } from "src/expenses-salary/expense-salaries.entity";
import { Order } from "src/orders/order.entity";
import { Purchase } from "src/purchase/purchase.entity";
import { Deskarea } from "src/reservations/deskarea/deskarea.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { Shared } from "src/reservations/shared/shared.entity";
import { Returns } from "src/returns/returns.entity";
import { RevenueChild } from "src/revenue/revenue-child/revenue-child.entity";
import { Revenue } from "src/revenue/revenue.entity";
import {
  PaymentMethod,
  ReservationStatus,
  TypeOrder,
  TypeSallary,
} from "src/shared/enum/global-enum";
import { Between, In, Repository } from "typeorm";
import { FiltersDashboredDto } from "./dto/filter-dashbored.dto";

@Injectable()
export class DahboredService {
  constructor(
    @InjectRepository(ExpensePlace)
    private readonly expensePlaceRepository: Repository<ExpensePlace>,

    @InjectRepository(Revenue)
    private readonly revenueRepository: Repository<Revenue>,

    @InjectRepository(Deals)
    private readonly dealsRepository: Repository<Deals>,

    @InjectRepository(ExpensePlaceChild)
    private readonly expensePlaceChildRepository: Repository<ExpensePlaceChild>,

    @InjectRepository(RevenueChild)
    private readonly revenueChildRepository: Repository<RevenueChild>,

    @InjectRepository(ExpenseSalaries)
    private readonly expenseSalariesRepository: Repository<ExpenseSalaries>,

    @InjectRepository(Purchase)
    private readonly purchasesRepository: Repository<Purchase>,

    @InjectRepository(Returns)
    private readonly returnsRepository: Repository<Returns>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(AssignesPackages)
    private readonly packagesRepository: Repository<AssignesPackages>,

    @InjectRepository(AssignesMembership)
    private readonly membershipRepository: Repository<AssignesMembership>,

    @InjectRepository(AssignGeneralOffer)
    private readonly generalOfferRepository: Repository<AssignGeneralOffer>,

    @InjectRepository(Shared)
    private readonly sharedRepository: Repository<Shared>,

    @InjectRepository(Deskarea)
    private readonly deskAreaRepository: Repository<Deskarea>,

    @InjectRepository(ReservationRoom)
    private readonly reservationRoomRepository: Repository<ReservationRoom>,
  ) {}

  async getAllExapsesInternalSallary(filter: FiltersDashboredDto) {
    return await this.expenseSalariesRepository
      .createQueryBuilder("expenseSalaries")
      .select("SUM(expenseSalaries.net_sallary)", "totalCost")
      .where("expenseSalaries.net_sallary > 0")
      .andWhere("expenseSalaries.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .andWhere("expenseSalaries.type_sallary = :typeSalary", { typeSalary: TypeSallary.Internal })
      .getRawOne();
  }

  async getAllRevenueToday(filter: FiltersDashboredDto) {
    const [
      dealsNet,
      dealsDeposites,
      reservationRoomNet,
      reservationRoomDeposites,
      packagesNet,
      packagesDeposites,
      membershipNet,
      membershipDeposites,
      sharedRevenue,
      deskAreaRevenue,
      orderPaid,
      orderCost,
      revenueChildSum,
      expenseSum,
      purchasesSum,
      returnsSum,
    ] = await Promise.all([
      // Deals with deposit subtraction using updated_at
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(
          `SUM(CASE WHEN deal.deposites > 0 AND deal.status != 'cancelled' THEN deal.total_price - deal.deposites ELSE deal.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Cach,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Deals deposits
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(`SUM(CASE WHEN deal.status = 'cancelled' THEN 0 ELSE deal.deposites END)`, "net")
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Cach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Reservation Room with deposit subtraction using updated_at
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.deposites > 0 AND reservation.status != 'cancelled' THEN reservation.total_price - reservation.deposites ELSE reservation.total_price END)`,
          "net",
        )
        .where({
          status: ReservationStatus.COMPLETE,
          payment_method: PaymentMethod.Cach,
        })
        .andWhere(
          "TO_DATE(reservation.selected_day, 'DD/MM/YYYY') BETWEEN :start_date::date AND :end_date::date",
          {
            start_date: filter.start_date,
            end_date: filter.end_date,
          },
        )
        .getRawOne(),

      // Reservation Room deposits
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.status = 'cancelled' THEN 0 ELSE reservation.deposites END)`,
          "net",
        )
        .where({
          payment_method: PaymentMethod.Cach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages with deposit subtraction using updated_at
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.deposites > 0 AND package.status != 'cancelled' THEN package.total_price - package.deposites ELSE package.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Cach,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages deposits
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.status = 'cancelled' THEN 0 ELSE package.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Cach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership with deposit subtraction using updated_at
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.deposites > 0 AND membership.status != 'cancelled' THEN membership.total_price - membership.deposites ELSE membership.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Cach,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership deposits
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.status = 'cancelled' THEN 0 ELSE membership.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Cach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Rest of the original queries (Shared, Desk Area, Orders, etc.)
      this.sharedRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.Cach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.deskAreaRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.Cach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Orders (keep original PAID/COST handling)
      this.orderRepository.sum("total_order", {
        type_order: TypeOrder.PAID,
        payment_method: PaymentMethod.Cach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.orderRepository.sum("order_price", {
        type_order: TypeOrder.COST,
        payment_method: PaymentMethod.Cach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Other financials (keep original)
      this.revenueChildRepository.sum("amount", {
        payment_method: PaymentMethod.Cach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.expensePlaceChildRepository.sum("cost", {
        payment_method: PaymentMethod.Cach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Purchases - all payment methods
      this.purchasesRepository.sum("total", {
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Returns - all payment methods
      this.returnsRepository.sum("total", {
        created_at: Between(filter.start_date, filter.end_date),
      }),
    ]);

    // Calculate net revenue with proper null handling
    const totalRevenue =
      (+dealsNet?.net || 0) +
      (+dealsDeposites?.net || 0) +
      (+reservationRoomNet?.net || 0) +
      (+reservationRoomDeposites?.net || 0) +
      (+packagesNet?.net || 0) +
      (+packagesDeposites?.net || 0) +
      (+membershipNet?.net || 0) +
      (+membershipDeposites?.net || 0) +
      (+sharedRevenue || 0) +
      (+deskAreaRevenue || 0) +
      (+orderPaid || 0) +
      (+orderCost || 0) + // Changed to subtract order costs
      (+revenueChildSum || 0) +
      (+returnsSum || 0) -
      (+expenseSum || 0) -
      (+purchasesSum || 0);

    return {
      total: totalRevenue,
      details: {
        dealsRevenue: +dealsNet?.net || 0,
        dealsDeposites: +dealsDeposites?.net || 0,
        reservationRoomRevenue: +reservationRoomNet?.net || 0,
        reservationRoomDeposites: +reservationRoomDeposites?.net || 0,
        packagesRevenue: +packagesNet?.net || 0,
        packagesDeposites: +packagesDeposites?.net || 0,
        membershipRevenue: +membershipNet?.net || 0,
        membershipDeposites: +membershipDeposites?.net || 0,
        sharedRevenue,
        deskAreaRevenue,
        orderPaid,
        orderCost,
        revenueChildSum,
        expenseSum,
        purchasesSum,
        returnsSum,
      },
    };
  }

  async getAllRevenueTodayVisa(filter: FiltersDashboredDto) {
    const [
      dealsNet,
      dealsDeposites,
      reservationRoomNet,
      reservationRoomDeposites,
      packagesNet,
      packagesDeposites,
      membershipNet,
      membershipDeposites,
      sharedRevenue,
      deskAreaRevenue,
      orderPaid,
      orderCost,
      revenueChildSum,
      expenseSum,
    ] = await Promise.all([
      // Deals with deposit subtraction using updated_at
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(
          `SUM(CASE WHEN deal.deposites > 0 AND deal.status != 'cancelled' THEN deal.total_price - deal.deposites ELSE deal.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Visa,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      this.dealsRepository
        .createQueryBuilder("deal")
        .select(`SUM(CASE WHEN deal.status = 'cancelled' THEN 0 ELSE deal.deposites END)`, "net")
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Visa,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Reservation Room with deposit subtraction using updated_at
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.deposites > 0 AND reservation.status != 'cancelled' THEN reservation.total_price - reservation.deposites ELSE reservation.total_price END)`,
          "net",
        )
        .where({
          status: ReservationStatus.COMPLETE,
          payment_method: PaymentMethod.Visa,
        })
        .andWhere(
          "TO_DATE(reservation.selected_day, 'DD/MM/YYYY') BETWEEN :start_date::date AND :end_date::date",
          {
            start_date: filter.start_date,
            end_date: filter.end_date,
          },
        )
        .getRawOne(),

      // Reservation Room deposits
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.status = 'cancelled' THEN 0 ELSE reservation.deposites END)`,
          "net",
        )
        .where({
          payment_method: PaymentMethod.Visa,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages with deposit subtraction using updated_at
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.deposites > 0 AND package.status != 'cancelled' THEN package.total_price - package.deposites ELSE package.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Visa,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages deposits
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.status = 'cancelled' THEN 0 ELSE package.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Visa,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership with deposit subtraction using updated_at
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.deposites > 0 AND membership.status != 'cancelled' THEN membership.total_price - membership.deposites ELSE membership.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Visa,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership deposits
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.status = 'cancelled' THEN 0 ELSE membership.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Visa,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Rest of the queries (Shared, Desk Area, Orders, etc.)
      this.sharedRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.Visa,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.deskAreaRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.Visa,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Orders (keep original PAID/COST handling)
      this.orderRepository.sum("total_order", {
        type_order: TypeOrder.PAID,
        payment_method: PaymentMethod.Visa,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.orderRepository.sum("order_price", {
        type_order: TypeOrder.COST,
        payment_method: PaymentMethod.Visa,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Other financials
      this.revenueChildRepository.sum("amount", {
        payment_method: PaymentMethod.Visa,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.expensePlaceChildRepository.sum("cost", {
        payment_method: PaymentMethod.Visa,
        created_at: Between(filter.start_date, filter.end_date),
      }),
    ]);

    // Calculate net revenue with proper null handling
    const totalRevenue =
      (+dealsNet?.net || 0) +
      (+dealsDeposites?.net || 0) +
      (+reservationRoomNet?.net || 0) +
      (+reservationRoomDeposites?.net || 0) +
      (+packagesNet?.net || 0) +
      (+packagesDeposites?.net || 0) +
      (+membershipNet?.net || 0) +
      (+membershipDeposites?.net || 0) +
      (sharedRevenue || 0) +
      (deskAreaRevenue || 0) +
      (orderPaid || 0) +
      (orderCost || 0) +
      (revenueChildSum || 0) -
      (expenseSum || 0);
    return {
      total: totalRevenue,
      details: {
        dealsRevenue: +dealsNet?.net || 0,
        dealsDeposites: +dealsDeposites?.net || 0,
        reservationRoomRevenue: +reservationRoomNet?.net || 0,
        reservationRoomDeposites: +reservationRoomDeposites?.net || 0,
        packagesRevenue: +packagesNet?.net || 0,
        packagesDeposites: +packagesDeposites?.net || 0,
        membershipRevenue: +membershipNet?.net || 0,
        membershipDeposites: +membershipDeposites?.net || 0,
        sharedRevenue,
        deskAreaRevenue,
        orderPaid,
        orderCost,
        revenueChildSum,
        expenseSum,
      },
    };
  }

  async getAllRevenueTodayVodafoneCash(filter: FiltersDashboredDto) {
    const [
      dealsNet,
      dealsDeposites,
      reservationRoomNet,
      reservationRoomDeposites,
      packagesNet,
      packagesDeposites,
      membershipNet,
      membershipDeposites,
      sharedRevenue,
      deskAreaRevenue,
      orderPaid,
      orderCost,
      revenueChildSum,
      expenseSum,
    ] = await Promise.all([
      // Deals with deposit subtraction
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(
          `SUM(CASE WHEN deal.deposites > 0 AND deal.status != 'cancelled' THEN deal.total_price - deal.deposites ELSE deal.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.VodafoneCach,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Deals deposits
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(`SUM(CASE WHEN deal.status = 'cancelled' THEN 0 ELSE deal.deposites END)`, "net")
        .where({
          is_paid: false,
          payment_method: PaymentMethod.VodafoneCach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Reservation Room with deposit subtraction
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.deposites > 0 AND reservation.status != 'cancelled' THEN reservation.total_price - reservation.deposites ELSE reservation.total_price END)`,
          "net",
        )
        .where({
          status: ReservationStatus.COMPLETE,
          payment_method: PaymentMethod.VodafoneCach,
        })
        .andWhere(
          "TO_DATE(reservation.selected_day, 'DD/MM/YYYY') BETWEEN :start_date::date AND :end_date::date",
          {
            start_date: filter.start_date,
            end_date: filter.end_date,
          },
        )
        .getRawOne(),

      // Reservation Room deposits
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.status = 'cancelled' THEN 0 ELSE reservation.deposites END)`,
          "net",
        )
        .where({
          payment_method: PaymentMethod.VodafoneCach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages with deposit subtraction
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.deposites > 0 AND package.status != 'cancelled' THEN package.total_price - package.deposites ELSE package.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.VodafoneCach,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages deposits
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.status = 'cancelled' THEN 0 ELSE package.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.VodafoneCach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership with deposit subtraction
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.deposites > 0 AND membership.status != 'cancelled' THEN membership.total_price - membership.deposites ELSE membership.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.VodafoneCach,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership deposits
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.status = 'cancelled' THEN 0 ELSE membership.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.VodafoneCach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      this.sharedRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.VodafoneCach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.deskAreaRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.VodafoneCach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Orders (keep original PAID/COST handling)
      this.orderRepository.sum("total_order", {
        type_order: TypeOrder.PAID,
        payment_method: PaymentMethod.VodafoneCach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.orderRepository.sum("order_price", {
        type_order: TypeOrder.COST,
        payment_method: PaymentMethod.VodafoneCach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Other financials
      this.revenueChildRepository.sum("amount", {
        payment_method: PaymentMethod.VodafoneCach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.expensePlaceChildRepository.sum("cost", {
        payment_method: PaymentMethod.VodafoneCach,
        created_at: Between(filter.start_date, filter.end_date),
      }),
    ]);

    // Calculate net revenue with proper null handling
    const totalRevenue =
      (+dealsNet?.net || 0) +
      (+dealsDeposites?.net || 0) +
      (+reservationRoomNet?.net || 0) +
      (+reservationRoomDeposites?.net || 0) +
      (+packagesNet?.net || 0) +
      (+packagesDeposites?.net || 0) +
      (+membershipNet?.net || 0) +
      (+membershipDeposites?.net || 0) +
      (sharedRevenue || 0) +
      (deskAreaRevenue || 0) +
      (orderPaid || 0) +
      (orderCost || 0) +
      (revenueChildSum || 0) -
      (expenseSum || 0);

    return {
      total: totalRevenue,
      details: {
        dealsRevenue: +dealsNet?.net || 0,
        dealsDeposites: +dealsDeposites?.net || 0,
        reservationRoomRevenue: +reservationRoomNet?.net || 0,
        reservationRoomDeposites: +reservationRoomDeposites?.net || 0,
        packagesRevenue: +packagesNet?.net || 0,
        packagesDeposites: +packagesDeposites?.net || 0,
        membershipRevenue: +membershipNet?.net || 0,
        membershipDeposites: +membershipDeposites?.net || 0,
        sharedRevenue,
        deskAreaRevenue,
        orderPaid,
        orderCost,
        revenueChildSum,
        expenseSum,
      },
    };
  }

  async getAllRevenueTodayInstapay(filter: FiltersDashboredDto) {
    const [
      dealsNet,
      dealsDeposites,
      reservationRoomNet,
      reservationRoomDeposites,
      packagesNet,
      packagesDeposites,
      membershipNet,
      membershipDeposites,
      sharedRevenue,
      deskAreaRevenue,
      orderPaid,
      orderCost,
      revenueChildSum,
      expenseSum,
    ] = await Promise.all([
      // Deals with deposit subtraction using updated_at
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(
          `SUM(CASE WHEN deal.deposites > 0 AND deal.status != 'cancelled' THEN deal.total_price - deal.deposites ELSE deal.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Instapay,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Deals deposits
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(`SUM(CASE WHEN deal.status = 'cancelled' THEN 0 ELSE deal.deposites END)`, "net")
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Instapay,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Reservation Room with deposit subtraction using updated_at
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.deposites > 0 AND reservation.status != 'cancelled' THEN reservation.total_price - reservation.deposites ELSE reservation.total_price END)`,
          "net",
        )
        .where({
          status: ReservationStatus.COMPLETE,
          payment_method: PaymentMethod.Instapay,
        })
        .andWhere(
          "TO_DATE(reservation.selected_day, 'DD/MM/YYYY') BETWEEN :start_date::date AND :end_date::date",
          {
            start_date: filter.start_date,
            end_date: filter.end_date,
          },
        )
        .getRawOne(),

      // Reservation Room deposits
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.status = 'cancelled' THEN 0 ELSE reservation.deposites END)`,
          "net",
        )
        .where({
          payment_method: PaymentMethod.Instapay,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages with deposit subtraction using updated_at
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.deposites > 0 AND package.status != 'cancelled' THEN package.total_price - package.deposites ELSE package.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Instapay,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages deposits
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.status = 'cancelled' THEN 0 ELSE package.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Instapay,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership with deposit subtraction using updated_at
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.deposites > 0 AND membership.status != 'cancelled' THEN membership.total_price - membership.deposites ELSE membership.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Instapay,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership deposits
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.status = 'cancelled' THEN 0 ELSE membership.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Instapay,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Rest of the queries (Shared, Desk Area, Orders, etc.)
      this.sharedRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.Instapay,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.deskAreaRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.Instapay,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Orders (keep original PAID/COST handling)
      this.orderRepository.sum("total_order", {
        type_order: TypeOrder.PAID,
        payment_method: PaymentMethod.Instapay,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.orderRepository.sum("order_price", {
        type_order: TypeOrder.COST,
        payment_method: PaymentMethod.Instapay,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Other financials
      this.revenueChildRepository.sum("amount", {
        payment_method: PaymentMethod.Instapay,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.expensePlaceChildRepository.sum("cost", {
        payment_method: PaymentMethod.Instapay,
        created_at: Between(filter.start_date, filter.end_date),
      }),
    ]);

    // Calculate net revenue with proper null handling
    const totalRevenue =
      (+dealsNet?.net || 0) +
      (+dealsDeposites?.net || 0) +
      (+reservationRoomNet?.net || 0) +
      (+reservationRoomDeposites?.net || 0) +
      (+packagesNet?.net || 0) +
      (+packagesDeposites?.net || 0) +
      (+membershipNet?.net || 0) +
      (+membershipDeposites?.net || 0) +
      (sharedRevenue || 0) +
      (deskAreaRevenue || 0) +
      (orderPaid || 0) +
      (orderCost || 0) +
      (revenueChildSum || 0) -
      (expenseSum || 0);
    return {
      total: totalRevenue,
      details: {
        dealsRevenue: +dealsNet?.net || 0,
        dealsDeposites: +dealsDeposites?.net || 0,
        reservationRoomRevenue: +reservationRoomNet?.net || 0,
        reservationRoomDeposites: +reservationRoomDeposites?.net || 0,
        packagesRevenue: +packagesNet?.net || 0,
        packagesDeposites: +packagesDeposites?.net || 0,
        membershipRevenue: +membershipNet?.net || 0,
        membershipDeposites: +membershipDeposites?.net || 0,
        sharedRevenue,
        deskAreaRevenue,
        orderPaid,
        orderCost,
        revenueChildSum,
        expenseSum,
      },
    };
  }

  async getAllExistClient(filter: FiltersDashboredDto) {
    const [sharedActive, deskActive, roomActive] = await Promise.all([
      this.sharedRepository.count({
        where: {
          status: ReservationStatus.ACTIVE,
          created_at: Between(filter.start_date, filter.end_date),
        },
      }),

      this.deskAreaRepository.count({
        where: {
          status: ReservationStatus.ACTIVE,
          created_at: Between(filter.start_date, filter.end_date),
        },
      }),

      this.reservationRoomRepository.count({
        where: {
          status: ReservationStatus.ACTIVE,
          created_at: Between(filter.start_date, filter.end_date),
        },
      }),
    ]);

    return {
      total: sharedActive + deskActive + roomActive,
    };
  }

  async getAllClientsRoomsActive(filter: FiltersDashboredDto) {
    const roomsActive = await this.reservationRoomRepository.count({
      where: {
        status: In([ReservationStatus.ACTIVE, ReservationStatus.PENDING]),
        created_at: Between(filter.start_date, filter.end_date),
      },
    });

    return {
      total: roomsActive,
    };
  }

  async getAllExistClientDeskareaActive(filter: FiltersDashboredDto) {
    const deskareaActive = await this.deskAreaRepository.count({
      where: {
        status: ReservationStatus.ACTIVE,
        created_at: Between(filter.start_date, filter.end_date),
      },
    });

    return {
      total: deskareaActive,
    };
  }

  async getAllExistClientSharedActive(filter: FiltersDashboredDto) {
    const sharedActive = await this.sharedRepository.count({
      where: {
        status: ReservationStatus.ACTIVE,
        created_at: Between(filter.start_date, filter.end_date),
      },
    });

    return {
      total: sharedActive,
    };
  }

  async getAllClientsRoomsCompleted(filter: FiltersDashboredDto) {
    const roomsActive = await this.reservationRoomRepository.count({
      where: {
        status: ReservationStatus.COMPLETE,
        created_at: Between(filter.start_date, filter.end_date),
      },
    });

    return {
      total: roomsActive,
    };
  }

  async getAllExistClientDeskareaCompleted(filter: FiltersDashboredDto) {
    const deskareaActive = await this.deskAreaRepository.count({
      where: {
        status: ReservationStatus.COMPLETE,
        created_at: Between(filter.start_date, filter.end_date),
      },
    });

    return {
      total: deskareaActive,
    };
  }

  async getAllExistClientSharedCompleted(filter: FiltersDashboredDto) {
    const sharedActive = await this.sharedRepository.count({
      where: {
        status: ReservationStatus.COMPLETE,
        created_at: Between(filter.start_date, filter.end_date),
      },
    });

    return {
      total: sharedActive,
    };
  }

  async getAllClientsRoomsCancelled(filter: FiltersDashboredDto) {
    const roomsActive = await this.reservationRoomRepository.count({
      where: {
        status: ReservationStatus.CANCELLED,
        created_at: Between(filter.start_date, filter.end_date),
      },
    });

    return {
      total: roomsActive,
    };
  }

  async getAllExistClientDeskareaCancelled(filter: FiltersDashboredDto) {
    const deskareaActive = await this.deskAreaRepository.count({
      where: {
        status: ReservationStatus.CANCELLED,
        created_at: Between(filter.start_date, filter.end_date),
      },
    });

    return {
      total: deskareaActive,
    };
  }

  async getAllExistClientSharedCancelled(filter: FiltersDashboredDto) {
    const sharedActive = await this.sharedRepository.count({
      where: {
        status: ReservationStatus.CANCELLED,
        created_at: Between(filter.start_date, filter.end_date),
      },
    });

    return {
      total: sharedActive,
    };
  }

  async getAllExapsesExternalSallary(filter: FiltersDashboredDto) {
    return await this.expenseSalariesRepository
      .createQueryBuilder("expenseSalaries")
      .select("SUM(expenseSalaries.net_sallary)", "totalCost")
      .where("expenseSalaries.net_sallary > 0")
      .andWhere("expenseSalaries.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .andWhere("expenseSalaries.type_sallary = :typeSalary", { typeSalary: TypeSallary.External })
      .getRawOne();
  }

  async getAllExapsesPlaceOther(filter: FiltersDashboredDto) {
    return await this.expensePlaceRepository
      .createQueryBuilder("expensePlace")
      .select("SUM(expensePlace.total)", "totalCost")
      .where("expensePlace.total > 0")
      .andWhere("expensePlace.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getAllExapsesPlace(filter: FiltersDashboredDto) {
    return await this.expensePlaceChildRepository
      .createQueryBuilder("expensePlaceChild")
      .select("SUM(expensePlaceChild.cost)", "totalCost")
      .where("expensePlaceChild.cost > 0")
      .andWhere("expensePlaceChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }
  async getAllExapsesInsurance(filter: FiltersDashboredDto) {
    return await this.expensePlaceChildRepository
      .createQueryBuilder("expensePlaceChild")
      .select("SUM(expensePlaceChild.cost)", "totalCost")
      .where("expensePlaceChild.cost > 0")
      .andWhere("expensePlaceChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("expensePlaceChild.expensePlace", "ee")
      .andWhere("ee.name = :name", { name: "insurance" })
      .getRawOne();
  }
  async getAllExapsesSystemFees(filter: FiltersDashboredDto) {
    return await this.expensePlaceChildRepository
      .createQueryBuilder("expensePlaceChild")
      .select("SUM(expensePlaceChild.cost)", "totalCost")
      .where("expensePlaceChild.cost > 0")
      .andWhere("expensePlaceChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("expensePlaceChild.expensePlace", "ee")
      .andWhere("ee.name = :name", { name: "internet_system_fees" })
      .getRawOne();
  }

  async getAllExapsesRents(filter: FiltersDashboredDto) {
    return await this.expensePlaceChildRepository
      .createQueryBuilder("expensePlaceChild")
      .select("SUM(expensePlaceChild.cost)", "totalCost")
      .where("expensePlaceChild.cost > 0")
      .andWhere("expensePlaceChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("expensePlaceChild.expensePlace", "ee")
      .andWhere("ee.name = :name", { name: "rents" })
      .getRawOne();
  }

  async getAllExapsesElectricityBills(filter: FiltersDashboredDto) {
    return await this.expensePlaceChildRepository
      .createQueryBuilder("expensePlaceChild")
      .select("SUM(expensePlaceChild.cost)", "totalCost")
      .where("expensePlaceChild.cost > 0")
      .andWhere("expensePlaceChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("expensePlaceChild.expensePlace", "ee")
      .andWhere("ee.name = :name", { name: "electricity_bills" })
      .getRawOne();
  }

  async getAllExapsesBonuses(filter: FiltersDashboredDto) {
    return await this.expensePlaceChildRepository
      .createQueryBuilder("expensePlaceChild")
      .select("SUM(expensePlaceChild.cost)", "totalCost")
      .where("expensePlaceChild.cost > 0")
      .andWhere("expensePlaceChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("expensePlaceChild.expensePlace", "ee")
      .andWhere("ee.name = :name", { name: "bonuses" })
      .getRawOne();
  }

  async getAllExapsesAssetsPurchased(filter: FiltersDashboredDto) {
    return await this.expensePlaceChildRepository
      .createQueryBuilder("expensePlaceChild")
      .select("SUM(expensePlaceChild.cost)", "totalCost")
      .where("expensePlaceChild.cost > 0")
      .andWhere("expensePlaceChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("expensePlaceChild.expensePlace", "ee")
      .andWhere("ee.name = :name", { name: "assets_purchased" })
      .getRawOne();
  }

  async getAllExapsesKitchenCost(filter: FiltersDashboredDto) {
    return await this.expensePlaceChildRepository
      .createQueryBuilder("expensePlaceChild")
      .select("SUM(expensePlaceChild.cost)", "totalCost")
      .where("expensePlaceChild.cost > 0")
      .andWhere("expensePlaceChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("expensePlaceChild.expensePlace", "ee")
      .andWhere("ee.name = :name", { name: "kitchen_cost" })
      .getRawOne();
  }

  async getAllExapsesCoursesCost(filter: FiltersDashboredDto) {
    return await this.expensePlaceChildRepository
      .createQueryBuilder("expensePlaceChild")
      .select("SUM(expensePlaceChild.cost)", "totalCost")
      .where("expensePlaceChild.cost > 0")
      .andWhere("expensePlaceChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("expensePlaceChild.expensePlace", "ee")
      .andWhere("ee.name = :name", { name: "courses_cost" })
      .getRawOne();
  }
  async getAllExapsesCharteredAccountantFees(filter: FiltersDashboredDto) {
    return await this.expensePlaceChildRepository
      .createQueryBuilder("expensePlaceChild")
      .select("SUM(expensePlaceChild.cost)", "totalCost")
      .where("expensePlaceChild.cost > 0")
      .andWhere("expensePlaceChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("expensePlaceChild.expensePlace", "ee")
      .andWhere("ee.name = :name", { name: "chartered_accountant_fees" })
      .getRawOne();
  }

  async getAllExapsesLoans(filter: FiltersDashboredDto) {
    return await this.expensePlaceChildRepository
      .createQueryBuilder("expensePlaceChild")
      .select("SUM(expensePlaceChild.cost)", "totalCost")
      .where("expensePlaceChild.cost > 0")
      .andWhere("expensePlaceChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("expensePlaceChild.expensePlace", "ee")
      .andWhere("ee.name = :name", { name: "loans" })
      .getRawOne();
  }

  async getAllExapsesOther(filter: FiltersDashboredDto) {
    return await this.expensePlaceChildRepository
      .createQueryBuilder("expensePlaceChild")
      .select("SUM(expensePlaceChild.cost)", "totalCost")
      .where("expensePlaceChild.cost > 0")
      .andWhere("expensePlaceChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("expensePlaceChild.expensePlace", "ee")
      .andWhere("ee.name = :name", { name: "other" })
      .getRawOne();
  }

  async getAllCountPurshases(filter: FiltersDashboredDto) {
    return await this.purchasesRepository
      .createQueryBuilder("purshase")
      .select("COUNT(purshase.id)", "count")
      .where("purshase.total > 0")
      .andWhere("purshase.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getAllAnotherRevenue(filter: FiltersDashboredDto) {
    return await this.revenueRepository
      .createQueryBuilder("revenue")
      .select("SUM(revenue.total)", "totalRevenue")
      .where("revenue.total > 0")
      .andWhere("revenue.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getAllRevenueVirtualOfficeIncome(filter: FiltersDashboredDto) {
    return await this.revenueChildRepository
      .createQueryBuilder("revenueChild")
      .select("SUM(revenueChild.amount)", "totalRevenue")
      .where("revenueChild.amount > 0")
      .andWhere("revenueChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("revenueChild.revenue", "ee")
      .andWhere("ee.name = :name", { name: "virtual_office_income" })
      .getRawOne();
  }

  async getAllRevenueOfficesIncome(filter: FiltersDashboredDto) {
    return await this.revenueChildRepository
      .createQueryBuilder("revenueChild")
      .select("SUM(revenueChild.amount)", "totalRevenue")
      .where("revenueChild.amount > 0")
      .andWhere("revenueChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("revenueChild.revenue", "ee")
      .andWhere("ee.name = :name", { name: "offices_income" })
      .getRawOne();
  }

  async getAllRevenueStoresIncome(filter: FiltersDashboredDto) {
    return await this.revenueChildRepository
      .createQueryBuilder("revenueChild")
      .select("SUM(revenueChild.amount)", "totalRevenue")
      .where("revenueChild.amount > 0")
      .andWhere("revenueChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("revenueChild.revenue", "ee")
      .andWhere("ee.name = :name", { name: "stores_income" })
      .getRawOne();
  }

  async getAllRevenuePrintIncome(filter: FiltersDashboredDto) {
    return await this.revenueChildRepository
      .createQueryBuilder("revenueChild")
      .select("SUM(revenueChild.amount)", "totalRevenue")
      .where("revenueChild.amount > 0")
      .andWhere("revenueChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("revenueChild.revenue", "ee")
      .andWhere("ee.name = :name", { name: "print_income" })
      .getRawOne();
  }

  async getAllRevenueLockerIncome(filter: FiltersDashboredDto) {
    return await this.revenueChildRepository
      .createQueryBuilder("revenueChild")
      .select("SUM(revenueChild.amount)", "totalRevenue")
      .where("revenueChild.amount > 0")
      .andWhere("revenueChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("revenueChild.revenue", "ee")
      .andWhere("ee.name = :name", { name: "locker_income" })
      .getRawOne();
  }

  async getAllRevenueExtraInternetIncome(filter: FiltersDashboredDto) {
    return await this.revenueChildRepository
      .createQueryBuilder("revenueChild")
      .select("SUM(revenueChild.amount)", "totalRevenue")
      .where("revenueChild.amount > 0")
      .andWhere("revenueChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("revenueChild.revenue", "ee")
      .andWhere("ee.name = :name", { name: "extra_internet_income" })
      .getRawOne();
  }

  async getAllRevenueCoursesIncome(filter: FiltersDashboredDto) {
    return await this.revenueChildRepository
      .createQueryBuilder("revenueChild")
      .select("SUM(revenueChild.amount)", "totalRevenue")
      .where("revenueChild.amount > 0")
      .andWhere("revenueChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("revenueChild.revenue", "ee")
      .andWhere("ee.name = :name", { name: "courses_income" })
      .getRawOne();
  }

  async getAllRevenueCoursesNetProfit(filter: FiltersDashboredDto) {
    return await this.revenueChildRepository
      .createQueryBuilder("revenueChild")
      .select("SUM(revenueChild.amount)", "totalRevenue")
      .where("revenueChild.amount > 0")
      .andWhere("revenueChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("revenueChild.revenue", "ee")
      .andWhere("ee.name = :name", { name: "courses_net_profit" })
      .getRawOne();
  }

  async getAllRevenueElectronicIncomeInvoices(filter: FiltersDashboredDto) {
    return await this.revenueChildRepository
      .createQueryBuilder("revenueChild")
      .select("SUM(revenueChild.amount)", "totalRevenue")
      .where("revenueChild.amount > 0")
      .andWhere("revenueChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("revenueChild.revenue", "ee")
      .andWhere("ee.name = :name", { name: "electronic_income_invoices" })
      .getRawOne();
  }

  async getAllRevenueElectronicExpensesInvoices(filter: FiltersDashboredDto) {
    return await this.revenueChildRepository
      .createQueryBuilder("revenueChild")
      .select("SUM(revenueChild.amount)", "totalRevenue")
      .where("revenueChild.amount > 0")
      .andWhere("revenueChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("revenueChild.revenue", "ee")
      .andWhere("ee.name = :name", { name: "electronic_expenses_invoices" })
      .getRawOne();
  }

  async getAllRevenueOther(filter: FiltersDashboredDto) {
    return await this.revenueChildRepository
      .createQueryBuilder("revenueChild")
      .select("SUM(revenueChild.amount)", "totalRevenue")
      .where("revenueChild.amount > 0")
      .andWhere("revenueChild.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .leftJoin("revenueChild.revenue", "ee")
      .andWhere("ee.name = :name", { name: "other" })
      .getRawOne();
  }

  async getTotalRevenueByStatus(
    repository: any,
    status: string,
    filter: FiltersDashboredDto,
    entityName: string,
  ) {
    return await repository
      .createQueryBuilder(entityName)
      .select(`SUM(${entityName}.total_price)`, "totalRevenue")
      .where(`${entityName}.total_price > 0`)
      .andWhere(`${entityName}.status = :status`, { status })
      .andWhere(`${entityName}.created_at BETWEEN :startFrom AND :startTo`, {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getAllTotalHours(
    repository: any,
    status: string,
    filter: FiltersDashboredDto,
    entityName: string,
  ) {
    return await repository
      .createQueryBuilder(entityName)
      .select(`SUM(${entityName}.total_time)`, "totalHour")
      .where(`${entityName}.total_time > 0`)
      .andWhere(`${entityName}.status = :status`, { status })
      .andWhere(`${entityName}.created_at BETWEEN :startFrom AND :startTo`, {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getAllTotalHourSharedCompleted(filter: FiltersDashboredDto) {
    return this.getAllTotalHours(this.sharedRepository, "complete", filter, "shared");
  }

  async getAllTotalHourDeskareaCompleted(filter: FiltersDashboredDto) {
    return this.getAllTotalHours(this.deskAreaRepository, "complete", filter, "deskarea");
  }

  async getAllTotalHourReservationRoomCompleted(filter: FiltersDashboredDto) {
    return this.getAllTotalHours(this.reservationRoomRepository, "complete", filter, "deskarea");
  }

  async getAllTotalPackages(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.packagesRepository, "complete", filter, "shared");
  }

  async getAllTotalCancelledPackages(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.packagesRepository, "cancelled", filter, "shared");
  }

  async getAllTotalActivePackages(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.packagesRepository, "active", filter, "shared");
  }

  async getAllTotalDeal(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.dealsRepository, "complete", filter, "deals");
  }

  async getAllTotalCancelledDeal(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.dealsRepository, "cancelled", filter, "deals");
  }

  async getAllTotalActiveDeal(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.dealsRepository, "active", filter, "deals");
  }

  async getAllTotalShared(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.sharedRepository, "complete", filter, "shared");
  }

  async getAllTotalCancelledShared(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.sharedRepository, "cancelled", filter, "shared");
  }

  async getAllTotalActiveShared(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.sharedRepository, "active", filter, "shared");
  }

  async getAllTotalDeskArea(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.deskAreaRepository, "complete", filter, "deskarea");
  }

  async getAllTotalCancelledDeskArea(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.deskAreaRepository, "cancelled", filter, "deskarea");
  }

  async getAllTotalActiveDeskArea(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.deskAreaRepository, "active", filter, "deskarea");
  }

  async getAllTotalReservationRoom(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(
      this.reservationRoomRepository,
      "complete",
      filter,
      "reservationRoom",
    );
  }

  async getAllTotalCancelledReservationRoom(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(
      this.reservationRoomRepository,
      "cancelled",
      filter,
      "reservationRoom",
    );
  }

  async getAllTotalActiveReservationRoom(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(
      this.reservationRoomRepository,
      "active",
      filter,
      "reservationRoom",
    );
  }

  async getAllTotalMemberShip(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(
      this.membershipRepository,
      "complete",
      filter,
      "membership",
    );
  }

  async getAllTotalCancelledMemberShip(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(
      this.membershipRepository,
      "cancelled",
      filter,
      "membership",
    );
  }

  async getAllTotalActiveMemberShip(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.membershipRepository, "active", filter, "membership");
  }

  async getAllTotalOffer(filter: FiltersDashboredDto) {
    return await this.generalOfferRepository
      .createQueryBuilder("offer")
      .select("COUNT(offer.id)", "count")
      .andWhere("offer.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getAllCountReturns(filter: FiltersDashboredDto) {
    return await this.returnsRepository
      .createQueryBuilder("returns")
      .select("COUNT(returns.id)", "count")
      .where("returns.total > 0")
      .andWhere("returns.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getTotalReturns(filter: FiltersDashboredDto) {
    return await this.returnsRepository
      .createQueryBuilder("returns")
      .select("SUM(returns.total)", "total")
      .where("returns.total > 0")
      .andWhere("returns.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getTotalPurshases(filter: FiltersDashboredDto) {
    return await this.purchasesRepository
      .createQueryBuilder("purshase")
      .select("SUM(purshase.total)", "total")
      .where("purshase.total > 0")
      .andWhere("purshase.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getCountPaidOrders(filter: FiltersDashboredDto) {
    return await this.orderRepository
      .createQueryBuilder("order")
      .select("COUNT(order.id)", "count")
      .where("order.type_order = 'PAID'")
      .andWhere("order.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }
  async getCountCostOrders(filter: FiltersDashboredDto) {
    return await this.orderRepository
      .createQueryBuilder("order")
      .select("COUNT(order.id)", "count")
      .where("order.type_order = 'COST'")
      .andWhere("order.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getCountFreeOrders(filter: FiltersDashboredDto) {
    return await this.orderRepository
      .createQueryBuilder("order")
      .select("COUNT(order.id)", "count")
      .where("order.type_order = 'FREE'")
      .andWhere("order.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getCountHoldOrders(filter: FiltersDashboredDto) {
    return await this.orderRepository
      .createQueryBuilder("order")
      .select("COUNT(order.id)", "count")
      .where("order.type_order = 'HOLD'")
      .andWhere("order.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getTotalPaidOrders(filter: FiltersDashboredDto) {
    return await this.orderRepository
      .createQueryBuilder("order")
      .select("SUM(order.total_order)", "total")
      .where("order.total_order > 0")
      .andWhere("order.type_order = 'PAID'")
      .andWhere("order.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getTotalCostOrders(filter: FiltersDashboredDto) {
    return await this.orderRepository
      .createQueryBuilder("order")
      .select("SUM(order.total_order)", "total")
      .where("order.total_order > 0")
      .andWhere("order.type_order = 'COST'")
      .andWhere("order.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getTotalHoldOrders(filter: FiltersDashboredDto) {
    return await this.orderRepository
      .createQueryBuilder("order")
      .select("SUM(order.total_order)", "total")
      .where("order.total_order > 0")
      .andWhere("order.type_order = 'HOLD'")
      .andWhere("order.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getTotalOrderPriceOrders(filter: FiltersDashboredDto) {
    return await this.orderRepository
      .createQueryBuilder("order")
      .select("SUM(order.order_price)", "total")
      .where("order.order_price > 0")
      .andWhere("order.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getCashRevenueForDeskAreas(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(this.deskAreaRepository, "deskarea", filter, PaymentMethod.Cach);
  }

  async getVisaRevenueForDeskAreas(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(this.deskAreaRepository, "deskarea", filter, PaymentMethod.Visa);
  }

  async getVodafoneCachRevenueForDeskAreas(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.deskAreaRepository,
      "deskarea",
      filter,
      PaymentMethod.VodafoneCach,
    );
  }

  async getInstapayRevenueForDeskAreas(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.deskAreaRepository,
      "deskarea",
      filter,
      PaymentMethod.Instapay,
    );
  }

  async getCashRevenueForDeals(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(this.dealsRepository, "deals", filter, PaymentMethod.Cach);
  }

  async getVisaRevenueForDeals(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(this.dealsRepository, "deals", filter, PaymentMethod.Visa);
  }

  async getVodafoneCachRevenueForDeals(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.dealsRepository,
      "deals",
      filter,
      PaymentMethod.VodafoneCach,
    );
  }

  async getInstapayRevenueForDeals(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(this.dealsRepository, "deals", filter, PaymentMethod.Instapay);
  }

  async getReservationRoomCashRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.reservationRoomRepository,
      "reservationRoom",
      filter,
      PaymentMethod.Cach,
    );
  }

  async getReservationRoomVisaRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.reservationRoomRepository,
      "reservationRoom",
      filter,
      PaymentMethod.Visa,
    );
  }

  async getReservationRoomInstaRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.reservationRoomRepository,
      "reservationRoom",
      filter,
      PaymentMethod.Instapay,
    );
  }

  async getReservationRoomVodafoneRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.reservationRoomRepository,
      "reservationRoom",
      filter,
      PaymentMethod.VodafoneCach,
    );
  }

  async getAssignesPackagesCashRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.packagesRepository,
      "assignesPackages",
      filter,
      PaymentMethod.Cach,
    );
  }

  async getAssignesPackagesInstaRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.packagesRepository,
      "assignesPackages",
      filter,
      PaymentMethod.Instapay,
    );
  }

  async getAssignesPackagesVisaRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.packagesRepository,
      "assignesPackages",
      filter,
      PaymentMethod.Visa,
    );
  }

  async getAssignesPackagesVodafoneRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.packagesRepository,
      "assignesPackages",
      filter,
      PaymentMethod.VodafoneCach,
    );
  }

  async getAssignesMemberShipCachRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.membershipRepository,
      "assignesMemberShip",
      filter,
      PaymentMethod.Cach,
    );
  }

  async getAssignesMemberShipVisaRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.membershipRepository,
      "assignesMemberShip",
      filter,
      PaymentMethod.Visa,
    );
  }

  async getAssignesMemberShipInstaRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.membershipRepository,
      "assignesMemberShip",
      filter,
      PaymentMethod.Instapay,
    );
  }

  async getAssignesMemberShipVodafoneRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.membershipRepository,
      "assignesMemberShip",
      filter,
      PaymentMethod.VodafoneCach,
    );
  }

  async getSharedCachRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(this.sharedRepository, "shared", filter, PaymentMethod.Cach);
  }

  async getSharedVisaRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(this.sharedRepository, "shared", filter, PaymentMethod.Visa);
  }

  async getSharedInstaRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(this.sharedRepository, "shared", filter, PaymentMethod.Instapay);
  }

  async getSharedVodafoneRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.sharedRepository,
      "shared",
      filter,
      PaymentMethod.VodafoneCach,
    );
  }

  async getOrderCachRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.orderRepository,
      "orders",
      filter,
      PaymentMethod.Cach,
      "type_order",
      TypeOrder.PAID,
      "total_order",
    );
  }

  async getOrderVisaRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.orderRepository,
      "orders",
      filter,
      PaymentMethod.Visa,
      "type_order",
      TypeOrder.PAID,
      "total_order",
    );
  }

  async getOrderInstaRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.orderRepository,
      "orders",
      filter,
      PaymentMethod.Instapay,
      "type_order",
      TypeOrder.PAID,
      "total_order",
    );
  }

  async getOrderVodafoneRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.orderRepository,
      "orders",
      filter,
      PaymentMethod.VodafoneCach,
      "type_order",
      TypeOrder.PAID,
      "total_order",
    );
  }

  async getOrderRevenueByType(
    filter: FiltersDashboredDto,
    paymentMethod: PaymentMethod,
    orderType: TypeOrder,
  ) {
    return this.getPaymentRevenue(
      this.orderRepository,
      "orders",
      filter,
      paymentMethod,
      "type_order",
      orderType,
      "order_price",
    );
  }

  private async getPaymentRevenue(
    repository: Repository<any>,
    entityName: string,
    filter: FiltersDashboredDto,
    method: PaymentMethod,
    status = "status",
    statusValue = "complete",
    total = "total_price",
  ) {
    return repository
      .createQueryBuilder(entityName)
      .select(`SUM(${entityName}.${total})`, "totalRevenue")
      .where(`${entityName}.payment_method = :method`, { method })
      .andWhere(`${entityName}.${status} = :status`, { status: statusValue })
      .andWhere(`${entityName}.${total} > 0`)
      .andWhere(`${entityName}.created_at BETWEEN :startDate AND :endDate`, {
        startDate: filter.start_date,
        endDate: filter.end_date,
      })
      .getRawOne();
  }

  async getAllRevenueTodayAllPaymentMethods(filter: FiltersDashboredDto) {
    const [
      dealsNet,
      dealsDeposites,
      reservationRoomNet,
      reservationRoomDeposites,
      packagesNet,
      packagesDeposites,
      membershipNet,
      membershipDeposites,
      sharedRevenue,
      deskAreaRevenue,
      orderPaid,
      orderCost,
      revenueChildSum,
      expenseSum,
      purchasesSum,
      returnsSum,
    ] = await Promise.all([
      // Deals with deposit subtraction using updated_at - all payment methods
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(
          `SUM(CASE WHEN deal.deposites > 0 AND deal.status != 'cancelled' THEN deal.total_price - deal.deposites ELSE deal.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Deals deposits - all payment methods
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(`SUM(CASE WHEN deal.status = 'cancelled' THEN 0 ELSE deal.deposites END)`, "net")
        .where({
          is_paid: false,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Reservation Room with deposit subtraction using updated_at - all payment methods
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.deposites > 0 AND reservation.status != 'cancelled' THEN reservation.total_price - reservation.deposites ELSE reservation.total_price END)`,
          "net",
        )
        .where({
          status: ReservationStatus.COMPLETE,
        })
        .andWhere(
          "TO_DATE(reservation.selected_day, 'DD/MM/YYYY') BETWEEN :start_date::date AND :end_date::date",
          {
            start_date: filter.start_date,
            end_date: filter.end_date,
          },
        )
        .getRawOne(),

      // Reservation Room deposits - all payment methods
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.status = 'cancelled' THEN 0 ELSE reservation.deposites END)`,
          "net",
        )
        .where({
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages with deposit subtraction using updated_at - all payment methods
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.deposites > 0 AND package.status != 'cancelled' THEN package.total_price - package.deposites ELSE package.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages deposits - all payment methods
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.status = 'cancelled' THEN 0 ELSE package.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership with deposit subtraction using updated_at - all payment methods
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.deposites > 0 AND membership.status != 'cancelled' THEN membership.total_price - membership.deposites ELSE membership.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership deposits - all payment methods
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.status = 'cancelled' THEN 0 ELSE membership.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Shared - all payment methods
      this.sharedRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Desk Area - all payment methods
      this.deskAreaRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Orders PAID - all payment methods
      this.orderRepository.sum("total_order", {
        type_order: TypeOrder.PAID,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Orders COST - all payment methods
      this.orderRepository.sum("order_price", {
        type_order: TypeOrder.COST,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Revenue Child - all payment methods
      this.revenueChildRepository.sum("amount", {
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Expense Place Child - all payment methods
      this.expensePlaceChildRepository.sum("cost", {
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Purchases - all payment methods
      this.purchasesRepository.sum("total", {
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Returns - all payment methods
      this.returnsRepository.sum("total", {
        created_at: Between(filter.start_date, filter.end_date),
      }),
    ]);

    const dealsRevenue = parseFloat(dealsNet?.net || "0");
    const dealsDepositesValue = parseFloat(dealsDeposites?.net || "0");
    const reservationRoomRevenue = parseFloat(reservationRoomNet?.net || "0");
    const reservationRoomDepositesValue = parseFloat(reservationRoomDeposites?.net || "0");
    const packagesRevenue = parseFloat(packagesNet?.net || "0");
    const packagesDepositesValue = parseFloat(packagesDeposites?.net || "0");
    const membershipRevenue = parseFloat(membershipNet?.net || "0");
    const membershipDepositesValue = parseFloat(membershipDeposites?.net || "0");
    const sharedRevenueValue = sharedRevenue || 0;
    const deskAreaRevenueValue = deskAreaRevenue || 0;
    const orderPaidValue = orderPaid || 0;
    const orderCostValue = orderCost || 0;
    const revenueChildSumValue = revenueChildSum || 0;
    const expenseSumValue = expenseSum || 0;
    const purchasesSumValue = purchasesSum || 0;
    const returnsSumValue = returnsSum || 0;

    const total =
      dealsRevenue +
      dealsDepositesValue +
      reservationRoomRevenue +
      reservationRoomDepositesValue +
      packagesRevenue +
      packagesDepositesValue +
      membershipRevenue +
      membershipDepositesValue +
      sharedRevenueValue +
      deskAreaRevenueValue +
      revenueChildSumValue +
      orderPaidValue +
      orderCostValue +
      returnsSumValue -
      expenseSumValue -
      purchasesSumValue;

    return {
      total,
      details: {
        dealsRevenue,
        dealsDeposites: dealsDepositesValue,
        reservationRoomRevenue,
        reservationRoomDeposites: reservationRoomDepositesValue,
        packagesRevenue,
        packagesDeposites: packagesDepositesValue,
        membershipRevenue,
        membershipDeposites: membershipDepositesValue,
        sharedRevenue: sharedRevenueValue,
        deskAreaRevenue: deskAreaRevenueValue,
        orderPaid: orderPaidValue,
        orderCost: orderCostValue,
        revenueChildSum: revenueChildSumValue,
        expenseSum: expenseSumValue,
        purchasesSum: purchasesSumValue,
        returnsSum: returnsSumValue,
      },
    };
  }

  async getAllRevenueTodayAllPaymentMethodsCash(filter: FiltersDashboredDto) {
    const [
      dealsNet,
      dealsDeposites,
      reservationRoomNet,
      reservationRoomDeposites,
      packagesNet,
      packagesDeposites,
      membershipNet,
      membershipDeposites,
      sharedRevenue,
      deskAreaRevenue,
      orderPaid,
      orderCost,
      revenueChildSum,
      expenseSum,
      purchasesSum,
      returnsSum,
    ] = await Promise.all([
      // Deals with deposit subtraction using updated_at - Cash payment method
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(
          `SUM(CASE WHEN deal.deposites > 0 AND deal.status != 'cancelled' THEN deal.total_price - deal.deposites ELSE deal.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Cach,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Deals deposits - Cash payment method
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(`SUM(CASE WHEN deal.status = 'cancelled' THEN 0 ELSE deal.deposites END)`, "net")
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Cach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Reservation Room with deposit subtraction using updated_at - Cash payment method
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.deposites > 0 AND reservation.status != 'cancelled' THEN reservation.total_price - reservation.deposites ELSE reservation.total_price END)`,
          "net",
        )
        .where({
          status: ReservationStatus.COMPLETE,
          payment_method: PaymentMethod.Cach,
        })
        .andWhere(
          "TO_DATE(reservation.selected_day, 'DD/MM/YYYY') BETWEEN :start_date::date AND :end_date::date",
          {
            start_date: filter.start_date,
            end_date: filter.end_date,
          },
        )
        .getRawOne(),

      // Reservation Room deposits - Cash payment method
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.status = 'cancelled' THEN 0 ELSE reservation.deposites END)`,
          "net",
        )
        .where({
          payment_method: PaymentMethod.Cach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages with deposit subtraction using updated_at - Cash payment method
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.deposites > 0 AND package.status != 'cancelled' THEN package.total_price - package.deposites ELSE package.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Cach,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages deposits - Cash payment method
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.status = 'cancelled' THEN 0 ELSE package.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Cach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership with deposit subtraction using updated_at - Cash payment method
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.deposites > 0 AND membership.status != 'cancelled' THEN membership.total_price - membership.deposites ELSE membership.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Cach,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership deposits - Cash payment method
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.status = 'cancelled' THEN 0 ELSE membership.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Cach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Shared - Cash payment method
      this.sharedRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.Cach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Desk Area - Cash payment method
      this.deskAreaRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.Cach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Orders PAID - Cash payment method
      this.orderRepository.sum("total_order", {
        type_order: TypeOrder.PAID,
        payment_method: PaymentMethod.Cach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Orders COST - Cash payment method
      this.orderRepository.sum("order_price", {
        type_order: TypeOrder.COST,
        payment_method: PaymentMethod.Cach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Revenue Child - Cash payment method
      this.revenueChildRepository.sum("amount", {
        payment_method: PaymentMethod.Cach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Expense Place Child - Cash payment method
      this.expensePlaceChildRepository.sum("cost", {
        payment_method: PaymentMethod.Cach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Purchases - all payment methods
      this.purchasesRepository.sum("total", {
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Returns - all payment methods
      this.returnsRepository.sum("total", {
        created_at: Between(filter.start_date, filter.end_date),
      }),
    ]);

    const dealsRevenue = parseFloat(dealsNet?.net || "0");
    const dealsDepositesValue = parseFloat(dealsDeposites?.net || "0");
    const reservationRoomRevenue = parseFloat(reservationRoomNet?.net || "0");
    const reservationRoomDepositesValue = parseFloat(reservationRoomDeposites?.net || "0");
    const packagesRevenue = parseFloat(packagesNet?.net || "0");
    const packagesDepositesValue = parseFloat(packagesDeposites?.net || "0");
    const membershipRevenue = parseFloat(membershipNet?.net || "0");
    const membershipDepositesValue = parseFloat(membershipDeposites?.net || "0");
    const sharedRevenueValue = sharedRevenue || 0;
    const deskAreaRevenueValue = deskAreaRevenue || 0;
    const orderPaidValue = orderPaid || 0;
    const orderCostValue = orderCost || 0;
    const revenueChildSumValue = revenueChildSum || 0;
    const expenseSumValue = expenseSum || 0;
    const purchasesSumValue = purchasesSum || 0;
    const returnsSumValue = returnsSum || 0;

    const total =
      dealsRevenue +
      dealsDepositesValue +
      reservationRoomRevenue +
      reservationRoomDepositesValue +
      packagesRevenue +
      packagesDepositesValue +
      membershipRevenue +
      membershipDepositesValue +
      sharedRevenueValue +
      deskAreaRevenueValue +
      revenueChildSumValue +
      orderPaidValue +
      orderCostValue +
      returnsSumValue -
      expenseSumValue -
      purchasesSumValue;

    return {
      total,
      details: {
        dealsRevenue,
        dealsDeposites: dealsDepositesValue,
        reservationRoomRevenue,
        reservationRoomDeposites: reservationRoomDepositesValue,
        packagesRevenue,
        packagesDeposites: packagesDepositesValue,
        membershipRevenue,
        membershipDeposites: membershipDepositesValue,
        sharedRevenue: sharedRevenueValue,
        deskAreaRevenue: deskAreaRevenueValue,
        orderPaid: orderPaidValue,
        orderCost: orderCostValue,
        revenueChildSum: revenueChildSumValue,
        expenseSum: expenseSumValue,
        purchasesSum: purchasesSumValue,
        returnsSum: returnsSumValue,
      },
    };
  }

  async getAllRevenueTodayAllPaymentMethodsInstapay(filter: FiltersDashboredDto) {
    const [
      dealsNet,
      dealsDeposites,
      reservationRoomNet,
      reservationRoomDeposites,
      packagesNet,
      packagesDeposites,
      membershipNet,
      membershipDeposites,
      sharedRevenue,
      deskAreaRevenue,
      orderPaid,
      orderCost,
      revenueChildSum,
      expenseSum,
      purchasesSum,
      returnsSum,
    ] = await Promise.all([
      // Deals with deposit subtraction using updated_at - Instapay payment method
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(
          `SUM(CASE WHEN deal.deposites > 0 AND deal.status != 'cancelled' THEN deal.total_price - deal.deposites ELSE deal.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Instapay,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Deals deposits - Instapay payment method
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(`SUM(CASE WHEN deal.status = 'cancelled' THEN 0 ELSE deal.deposites END)`, "net")
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Instapay,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Reservation Room with deposit subtraction using updated_at - Instapay payment method
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.deposites > 0 AND reservation.status != 'cancelled' THEN reservation.total_price - reservation.deposites ELSE reservation.total_price END)`,
          "net",
        )
        .where({
          status: ReservationStatus.COMPLETE,
          payment_method: PaymentMethod.Instapay,
        })
        .andWhere(
          "TO_DATE(reservation.selected_day, 'DD/MM/YYYY') BETWEEN :start_date::date AND :end_date::date",
          {
            start_date: filter.start_date,
            end_date: filter.end_date,
          },
        )
        .getRawOne(),

      // Reservation Room deposits - Instapay payment method
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.status = 'cancelled' THEN 0 ELSE reservation.deposites END)`,
          "net",
        )
        .where({
          payment_method: PaymentMethod.Instapay,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages with deposit subtraction using updated_at - Instapay payment method
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.deposites > 0 AND package.status != 'cancelled' THEN package.total_price - package.deposites ELSE package.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Instapay,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages deposits - Instapay payment method
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.status = 'cancelled' THEN 0 ELSE package.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Instapay,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership with deposit subtraction using updated_at - Instapay payment method
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.deposites > 0 AND membership.status != 'cancelled' THEN membership.total_price - membership.deposites ELSE membership.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Instapay,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership deposits - Instapay payment method
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.status = 'cancelled' THEN 0 ELSE membership.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Instapay,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Shared - Instapay payment method
      this.sharedRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.Instapay,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Desk Area - Instapay payment method
      this.deskAreaRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.Instapay,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Orders PAID - Instapay payment method
      this.orderRepository.sum("total_order", {
        type_order: TypeOrder.PAID,
        payment_method: PaymentMethod.Instapay,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Orders COST - Instapay payment method
      this.orderRepository.sum("order_price", {
        type_order: TypeOrder.COST,
        payment_method: PaymentMethod.Instapay,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Revenue Child - Instapay payment method
      this.revenueChildRepository.sum("amount", {
        payment_method: PaymentMethod.Instapay,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Expense Place Child - Instapay payment method
      this.expensePlaceChildRepository.sum("cost", {
        payment_method: PaymentMethod.Instapay,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Purchases - all payment methods
      this.purchasesRepository.sum("total", {
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Returns - all payment methods
      this.returnsRepository.sum("total", {
        created_at: Between(filter.start_date, filter.end_date),
      }),
    ]);

    const dealsRevenue = parseFloat(dealsNet?.net || "0");
    const dealsDepositesValue = parseFloat(dealsDeposites?.net || "0");
    const reservationRoomRevenue = parseFloat(reservationRoomNet?.net || "0");
    const reservationRoomDepositesValue = parseFloat(reservationRoomDeposites?.net || "0");
    const packagesRevenue = parseFloat(packagesNet?.net || "0");
    const packagesDepositesValue = parseFloat(packagesDeposites?.net || "0");
    const membershipRevenue = parseFloat(membershipNet?.net || "0");
    const membershipDepositesValue = parseFloat(membershipDeposites?.net || "0");
    const sharedRevenueValue = sharedRevenue || 0;
    const deskAreaRevenueValue = deskAreaRevenue || 0;
    const orderPaidValue = orderPaid || 0;
    const orderCostValue = orderCost || 0;
    const revenueChildSumValue = revenueChildSum || 0;
    const expenseSumValue = expenseSum || 0;
    const purchasesSumValue = purchasesSum || 0;
    const returnsSumValue = returnsSum || 0;

    const total =
      dealsRevenue +
      dealsDepositesValue +
      reservationRoomRevenue +
      reservationRoomDepositesValue +
      packagesRevenue +
      packagesDepositesValue +
      membershipRevenue +
      membershipDepositesValue +
      sharedRevenueValue +
      deskAreaRevenueValue +
      revenueChildSumValue +
      orderPaidValue +
      orderCostValue +
      returnsSumValue -
      expenseSumValue -
      purchasesSumValue;

    return {
      total,
      details: {
        dealsRevenue,
        dealsDeposites: dealsDepositesValue,
        reservationRoomRevenue,
        reservationRoomDeposites: reservationRoomDepositesValue,
        packagesRevenue,
        packagesDeposites: packagesDepositesValue,
        membershipRevenue,
        membershipDeposites: membershipDepositesValue,
        sharedRevenue: sharedRevenueValue,
        deskAreaRevenue: deskAreaRevenueValue,
        orderPaid: orderPaidValue,
        orderCost: orderCostValue,
        revenueChildSum: revenueChildSumValue,
        expenseSum: expenseSumValue,
        purchasesSum: purchasesSumValue,
        returnsSum: returnsSumValue,
      },
    };
  }

  async getAllRevenueTodayAllPaymentMethodsVodafoneCash(filter: FiltersDashboredDto) {
    const [
      dealsNet,
      dealsDeposites,
      reservationRoomNet,
      reservationRoomDeposites,
      packagesNet,
      packagesDeposites,
      membershipNet,
      membershipDeposites,
      sharedRevenue,
      deskAreaRevenue,
      orderPaid,
      orderCost,
      revenueChildSum,
      expenseSum,
      purchasesSum,
      returnsSum,
    ] = await Promise.all([
      // Deals with deposit subtraction using updated_at - Vodafone Cash payment method
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(
          `SUM(CASE WHEN deal.deposites > 0 AND deal.status != 'cancelled' THEN deal.total_price - deal.deposites ELSE deal.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.VodafoneCach,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Deals deposits - Vodafone Cash payment method
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(`SUM(CASE WHEN deal.status = 'cancelled' THEN 0 ELSE deal.deposites END)`, "net")
        .where({
          is_paid: false,
          payment_method: PaymentMethod.VodafoneCach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Reservation Room with deposit subtraction using updated_at - Vodafone Cash payment method
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.deposites > 0 AND reservation.status != 'cancelled' THEN reservation.total_price - reservation.deposites ELSE reservation.total_price END)`,
          "net",
        )
        .where({
          status: ReservationStatus.COMPLETE,
          payment_method: PaymentMethod.VodafoneCach,
        })
        .andWhere(
          "TO_DATE(reservation.selected_day, 'DD/MM/YYYY') BETWEEN :start_date::date AND :end_date::date",
          {
            start_date: filter.start_date,
            end_date: filter.end_date,
          },
        )
        .getRawOne(),

      // Reservation Room deposits - Vodafone Cash payment method
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.status = 'cancelled' THEN 0 ELSE reservation.deposites END)`,
          "net",
        )
        .where({
          payment_method: PaymentMethod.VodafoneCach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages with deposit subtraction using updated_at - Vodafone Cash payment method
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.deposites > 0 AND package.status != 'cancelled' THEN package.total_price - package.deposites ELSE package.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.VodafoneCach,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages deposits - Vodafone Cash payment method
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.status = 'cancelled' THEN 0 ELSE package.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.VodafoneCach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership with deposit subtraction using updated_at - Vodafone Cash payment method
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.deposites > 0 AND membership.status != 'cancelled' THEN membership.total_price - membership.deposites ELSE membership.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.VodafoneCach,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership deposits - Vodafone Cash payment method
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.status = 'cancelled' THEN 0 ELSE membership.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.VodafoneCach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Shared - Vodafone Cash payment method
      this.sharedRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.VodafoneCach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Desk Area - Vodafone Cash payment method
      this.deskAreaRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.VodafoneCach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Orders PAID - Vodafone Cash payment method
      this.orderRepository.sum("total_order", {
        type_order: TypeOrder.PAID,
        payment_method: PaymentMethod.VodafoneCach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Orders COST - Vodafone Cash payment method
      this.orderRepository.sum("order_price", {
        type_order: TypeOrder.COST,
        payment_method: PaymentMethod.VodafoneCach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Revenue Child - Vodafone Cash payment method
      this.revenueChildRepository.sum("amount", {
        payment_method: PaymentMethod.VodafoneCach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Expense Place Child - Vodafone Cash payment method
      this.expensePlaceChildRepository.sum("cost", {
        payment_method: PaymentMethod.VodafoneCach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Purchases - all payment methods
      this.purchasesRepository.sum("total", {
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Returns - all payment methods
      this.returnsRepository.sum("total", {
        created_at: Between(filter.start_date, filter.end_date),
      }),
    ]);

    const dealsRevenue = parseFloat(dealsNet?.net || "0");
    const dealsDepositesValue = parseFloat(dealsDeposites?.net || "0");
    const reservationRoomRevenue = parseFloat(reservationRoomNet?.net || "0");
    const reservationRoomDepositesValue = parseFloat(reservationRoomDeposites?.net || "0");
    const packagesRevenue = parseFloat(packagesNet?.net || "0");
    const packagesDepositesValue = parseFloat(packagesDeposites?.net || "0");
    const membershipRevenue = parseFloat(membershipNet?.net || "0");
    const membershipDepositesValue = parseFloat(membershipDeposites?.net || "0");
    const sharedRevenueValue = sharedRevenue || 0;
    const deskAreaRevenueValue = deskAreaRevenue || 0;
    const orderPaidValue = orderPaid || 0;
    const orderCostValue = orderCost || 0;
    const revenueChildSumValue = revenueChildSum || 0;
    const expenseSumValue = expenseSum || 0;
    const purchasesSumValue = purchasesSum || 0;
    const returnsSumValue = returnsSum || 0;

    const total =
      dealsRevenue +
      dealsDepositesValue +
      reservationRoomRevenue +
      reservationRoomDepositesValue +
      packagesRevenue +
      packagesDepositesValue +
      membershipRevenue +
      membershipDepositesValue +
      sharedRevenueValue +
      deskAreaRevenueValue +
      revenueChildSumValue +
      orderPaidValue +
      orderCostValue +
      returnsSumValue -
      expenseSumValue -
      purchasesSumValue;

    return {
      total,
      details: {
        dealsRevenue,
        dealsDeposites: dealsDepositesValue,
        reservationRoomRevenue,
        reservationRoomDeposites: reservationRoomDepositesValue,
        packagesRevenue,
        packagesDeposites: packagesDepositesValue,
        membershipRevenue,
        membershipDeposites: membershipDepositesValue,
        sharedRevenue: sharedRevenueValue,
        deskAreaRevenue: deskAreaRevenueValue,
        orderPaid: orderPaidValue,
        orderCost: orderCostValue,
        revenueChildSum: revenueChildSumValue,
        expenseSum: expenseSumValue,
        purchasesSum: purchasesSumValue,
        returnsSum: returnsSumValue,
      },
    };
  }

  async getAllRevenueTodayAllPaymentMethodsVisa(filter: FiltersDashboredDto) {
    const [
      dealsNet,
      dealsDeposites,
      reservationRoomNet,
      reservationRoomDeposites,
      packagesNet,
      packagesDeposites,
      membershipNet,
      membershipDeposites,
      sharedRevenue,
      deskAreaRevenue,
      orderPaid,
      orderCost,
      revenueChildSum,
      expenseSum,
      purchasesSum,
      returnsSum,
    ] = await Promise.all([
      // Deals with deposit subtraction using updated_at - Visa payment method
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(
          `SUM(CASE WHEN deal.deposites > 0 AND deal.status != 'cancelled' THEN deal.total_price - deal.deposites ELSE deal.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Visa,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Deals deposits - Visa payment method
      this.dealsRepository
        .createQueryBuilder("deal")
        .select(`SUM(CASE WHEN deal.status = 'cancelled' THEN 0 ELSE deal.deposites END)`, "net")
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Visa,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Reservation Room with deposit subtraction using updated_at - Visa payment method
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.deposites > 0 AND reservation.status != 'cancelled' THEN reservation.total_price - reservation.deposites ELSE reservation.total_price END)`,
          "net",
        )
        .where({
          status: ReservationStatus.COMPLETE,
          payment_method: PaymentMethod.Visa,
        })
        .andWhere(
          "TO_DATE(reservation.selected_day, 'DD/MM/YYYY') BETWEEN :start_date::date AND :end_date::date",
          {
            start_date: filter.start_date,
            end_date: filter.end_date,
          },
        )
        .getRawOne(),

      // Reservation Room deposits - Visa payment method
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .select(
          `SUM(CASE WHEN reservation.status = 'cancelled' THEN 0 ELSE reservation.deposites END)`,
          "net",
        )
        .where({
          payment_method: PaymentMethod.Visa,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages with deposit subtraction using updated_at - Visa payment method
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.deposites > 0 AND package.status != 'cancelled' THEN package.total_price - package.deposites ELSE package.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Visa,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages deposits - Visa payment method
      this.packagesRepository
        .createQueryBuilder("package")
        .select(
          `SUM(CASE WHEN package.status = 'cancelled' THEN 0 ELSE package.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Visa,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership with deposit subtraction using updated_at - Visa payment method
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.deposites > 0 AND membership.status != 'cancelled' THEN membership.total_price - membership.deposites ELSE membership.total_price END)`,
          "net",
        )
        .where({
          is_paid: true,
          payment_method: PaymentMethod.Visa,
          updated_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership deposits - Visa payment method
      this.membershipRepository
        .createQueryBuilder("membership")
        .select(
          `SUM(CASE WHEN membership.status = 'cancelled' THEN 0 ELSE membership.deposites END)`,
          "net",
        )
        .where({
          is_paid: false,
          payment_method: PaymentMethod.Visa,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Shared - Visa payment method
      this.sharedRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.Visa,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Desk Area - Visa payment method
      this.deskAreaRepository.sum("total_price", {
        status: ReservationStatus.COMPLETE,
        payment_method: PaymentMethod.Visa,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Orders PAID - Visa payment method
      this.orderRepository.sum("total_order", {
        type_order: TypeOrder.PAID,
        payment_method: PaymentMethod.Visa,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Orders COST - Visa payment method
      this.orderRepository.sum("order_price", {
        type_order: TypeOrder.COST,
        payment_method: PaymentMethod.Visa,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Revenue Child - Visa payment method
      this.revenueChildRepository.sum("amount", {
        payment_method: PaymentMethod.Visa,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Expense Place Child - Visa payment method
      this.expensePlaceChildRepository.sum("cost", {
        payment_method: PaymentMethod.Visa,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Purchases - all payment methods
      this.purchasesRepository.sum("total", {
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Returns - all payment methods
      this.returnsRepository.sum("total", {
        created_at: Between(filter.start_date, filter.end_date),
      }),
    ]);

    const dealsRevenue = parseFloat(dealsNet?.net || "0");
    const dealsDepositesValue = parseFloat(dealsDeposites?.net || "0");
    const reservationRoomRevenue = parseFloat(reservationRoomNet?.net || "0");
    const reservationRoomDepositesValue = parseFloat(reservationRoomDeposites?.net || "0");
    const packagesRevenue = parseFloat(packagesNet?.net || "0");
    const packagesDepositesValue = parseFloat(packagesDeposites?.net || "0");
    const membershipRevenue = parseFloat(membershipNet?.net || "0");
    const membershipDepositesValue = parseFloat(membershipDeposites?.net || "0");
    const sharedRevenueValue = sharedRevenue || 0;
    const deskAreaRevenueValue = deskAreaRevenue || 0;
    const orderPaidValue = orderPaid || 0;
    const orderCostValue = orderCost || 0;
    const revenueChildSumValue = revenueChildSum || 0;
    const expenseSumValue = expenseSum || 0;
    const purchasesSumValue = purchasesSum || 0;
    const returnsSumValue = returnsSum || 0;

    const total =
      dealsRevenue +
      dealsDepositesValue +
      reservationRoomRevenue +
      reservationRoomDepositesValue +
      packagesRevenue +
      packagesDepositesValue +
      membershipRevenue +
      membershipDepositesValue +
      sharedRevenueValue +
      deskAreaRevenueValue +
      revenueChildSumValue +
      orderPaidValue +
      orderCostValue +
      returnsSumValue -
      expenseSumValue -
      purchasesSumValue;

    return {
      total,
      details: {
        dealsRevenue,
        dealsDeposites: dealsDepositesValue,
        reservationRoomRevenue,
        reservationRoomDeposites: reservationRoomDepositesValue,
        packagesRevenue,
        packagesDeposites: packagesDepositesValue,
        membershipRevenue,
        membershipDeposites: membershipDepositesValue,
        sharedRevenue: sharedRevenueValue,
        deskAreaRevenue: deskAreaRevenueValue,
        orderPaid: orderPaidValue,
        orderCost: orderCostValue,
        revenueChildSum: revenueChildSumValue,
        expenseSum: expenseSumValue,
        purchasesSum: purchasesSumValue,
        returnsSum: returnsSumValue,
      },
    };
  }
}
