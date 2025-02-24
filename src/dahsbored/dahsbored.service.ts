import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExpensePlaceChild } from "src/expenses-place/expenses-place-child/expense-place-child.entity";
import { ExpenseSalaries } from "src/expenses-salary/expense-salaries.entity";
import { Order } from "src/orders/order.entity";
import { Purchases } from "src/purchases/purchases.entity";
import { Returns } from "src/returns/returns.entity";
import { RevenueChild } from "src/revenue/revenue-child/revenue-child.entity";
import { TypeSallary } from "src/shared/enum/global-enum";
import { Repository } from "typeorm";
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
  ) {}

  async getAllExapsesInternalSallary(filter: FiltersDashboredDto) {
    return await this.expenseSalariesRepository
      .createQueryBuilder("expenseSalaries")
      .select("SUM(expenseSalaries.cost)", "totalCost")
      .where("expenseSalaries.cost > 0")
      .andWhere("expenseSalaries.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .andWhere("expenseSalaries.type_sallary = :typeSalary", { typeSalary: TypeSallary.Internal })
      .getRawOne();
  }
  async getAllExapsesExternalSallary(filter: FiltersDashboredDto) {
    return await this.expenseSalariesRepository
      .createQueryBuilder("expenseSalaries")
      .select("SUM(expenseSalaries.cost)", "totalCost")
      .where("expenseSalaries.cost > 0")
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
