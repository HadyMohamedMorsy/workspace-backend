import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { Deals } from "src/deals/deals.entity";
import { Deposite } from "src/deposit/deposites.entity";
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
  DepositeStatus,
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

    @InjectRepository(Deposite)
    private readonly depositeRepository: Repository<Deposite>,

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
      reservationRoomNet,
      packagesNet,
      membershipNet,
      sharedRevenue,
      deskAreaRevenue,
      depositeRevenue,
      orderPaid,
      orderCost,
      revenueChildSum,
      expenseSum,
      purchasesSum,
      returnsSum,
    ] = await Promise.all([
      // Deals with deposit subtraction
      this.dealsRepository
        .createQueryBuilder("deal")
        .leftJoin("deal.deposites", "deposite")
        .select("SUM(deal.total_price - COALESCE(deposite.total_price, 0))", "net")
        .where({
          status: In([ReservationStatus.ACTIVE, ReservationStatus.COMPLETE]),
          payment_method: PaymentMethod.Cach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Reservation Room with deposit subtraction
      this.reservationRoomRepository
        .createQueryBuilder("reservation")
        .leftJoin("reservation.deposites", "deposite")
        .select("SUM(reservation.total_price - COALESCE(deposite.total_price, 0))", "net")
        .where({
          status: In([ReservationStatus.ACTIVE, ReservationStatus.COMPLETE]),
          payment_method: PaymentMethod.Cach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Packages with deposit subtraction
      this.packagesRepository
        .createQueryBuilder("package")
        .leftJoin("package.deposites", "deposite")
        .select("SUM(package.total_price - COALESCE(deposite.total_price, 0))", "net")
        .where({
          status: In([ReservationStatus.ACTIVE, ReservationStatus.COMPLETE]),
          payment_method: PaymentMethod.Cach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Membership with deposit subtraction
      this.membershipRepository
        .createQueryBuilder("membership")
        .leftJoin("membership.deposites", "deposite")
        .select("SUM(membership.total_price - COALESCE(deposite.total_price, 0))", "net")
        .where({
          status: In([ReservationStatus.ACTIVE, ReservationStatus.COMPLETE]),
          payment_method: PaymentMethod.Cach,
          created_at: Between(filter.start_date, filter.end_date),
        })
        .getRawOne(),

      // Rest of the original queries (Shared, Desk Area, Deposites, Orders, etc.)
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

      this.depositeRepository.sum("total_price", {
        status: DepositeStatus.COMPLETE,
        payment_method: PaymentMethod.Cach,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Orders (keep original PAID/COST handling)
      this.orderRepository.sum("total_order", {
        type_order: TypeOrder.PAID,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.orderRepository.sum("total_order", {
        type_order: TypeOrder.COST,
        created_at: Between(filter.start_date, filter.end_date),
      }),

      // Other financials (keep original)
      this.revenueChildRepository.sum("amount", {
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.expensePlaceChildRepository.sum("cost", {
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.purchasesRepository.sum("total", {
        created_at: Between(filter.start_date, filter.end_date),
      }),

      this.returnsRepository.sum("total", {
        created_at: Between(filter.start_date, filter.end_date),
      }),
    ]);

    // Calculate net revenue with proper null handling
    const totalRevenue =
      (+dealsNet?.net || 0) +
      (+reservationRoomNet?.net || 0) +
      (+packagesNet?.net || 0) +
      (+membershipNet?.net || 0) +
      (sharedRevenue || 0) +
      (deskAreaRevenue || 0) +
      (depositeRevenue || 0) +
      (orderPaid || 0) -
      (orderCost || 0) + // Changed to subtract order costs
      (revenueChildSum || 0) +
      (returnsSum || 0) -
      (expenseSum || 0) -
      (purchasesSum || 0);
    return {
      total: totalRevenue,
      details: {
        dealsRevenue: +dealsNet?.net || 0,
        reservationRoomRevenue: +reservationRoomNet?.net || 0,
        packagesRevenue: +packagesNet?.net || 0,
        membershipRevenue: +membershipNet?.net || 0,
        sharedRevenue,
        deskAreaRevenue,
        depositeRevenue,
        orderPaid,
        orderCost,
        revenueChildSum,
        expenseSum,
        purchasesSum,
        returnsSum,
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
        status: ReservationStatus.ACTIVE,
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

  async getAllTotalDeposit(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.depositeRepository, "complete", filter, "deposite");
  }

  async getAllTotalCancelledDeposit(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.depositeRepository, "cancelled", filter, "deposite");
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
  async getDepositeCachRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(this.depositeRepository, "deposite", filter, PaymentMethod.Cach);
  }

  async getDepositeVisaRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(this.depositeRepository, "deposite", filter, PaymentMethod.Visa);
  }

  async getDepositeInstaRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.depositeRepository,
      "deposite",
      filter,
      PaymentMethod.Instapay,
    );
  }

  async getDepositeVodafoneRevenue(filter: FiltersDashboredDto) {
    return this.getPaymentRevenue(
      this.depositeRepository,
      "deposite",
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
}
