import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssignGeneralOffer } from "src/assignes-global-offers/assignes-general-offer.entity";
import { AssignesMembership } from "src/assignes-memberships/assignes-membership.entity";
import { AssignesPackages } from "src/assigness-packages-offers/assignes-packages.entity";
import { ExpensePlaceChild } from "src/expenses-place/expenses-place-child/expense-place-child.entity";
import { ExpenseSalaries } from "src/expenses-salary/expense-salaries.entity";
import { Order } from "src/orders/order.entity";
import { Purchases } from "src/purchases/purchases.entity";
import { Deskarea } from "src/reservations/deskarea/deskarea.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { Shared } from "src/reservations/shared/shared.entity";
import { Returns } from "src/returns/returns.entity";
import { RevenueChild } from "src/revenue/revenue-child/revenue-child.entity";
import { ReservationStatus, TypeSallary } from "src/shared/enum/global-enum";
import { Between, Repository } from "typeorm";
import { FiltersDashboredDto } from "./dto/filter-dashbored.dto";

@Injectable()
export class DahboredService {
  constructor(
    @InjectRepository(ExpensePlaceChild)
    private readonly expensePlaceChildRepository: Repository<ExpensePlaceChild>,

    @InjectRepository(RevenueChild)
    private readonly revenueChildRepository: Repository<RevenueChild>,

    @InjectRepository(ExpenseSalaries)
    private readonly expenseSalariesRepository: Repository<ExpenseSalaries>,

    @InjectRepository(Purchases)
    private readonly purchasesRepository: Repository<Purchases>,

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
    return this.getTotalRevenueByStatus(this.deskAreaRepository, "complete", filter, "shared");
  }

  async getAllTotalCancelledDeal(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.deskAreaRepository, "cancelled", filter, "shared");
  }

  async getAllTotalActiveDeal(filter: FiltersDashboredDto) {
    return this.getTotalRevenueByStatus(this.deskAreaRepository, "active", filter, "shared");
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
}
