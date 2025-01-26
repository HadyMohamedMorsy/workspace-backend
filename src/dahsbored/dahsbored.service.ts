import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ExpensePlaceChild } from "src/expenses-place/expenses-place-child/expense-place-child.entity";
import { ExpenseSalaries } from "src/expenses-salary/expense-salaries.entity";
import { Order } from "src/orders/order.entity";
import { Purchases } from "src/purchases/purchases.entity";
import { Returns } from "src/returns/returns.entity";
import { Repository } from "typeorm";
import { FiltersDashboredDto } from "./dto/filter-dashbored.dto";

@Injectable()
export class DahboredService {
  constructor(
    @InjectRepository(ExpensePlaceChild)
    private readonly expensePlaceChildRepository: Repository<ExpensePlaceChild>,

    @InjectRepository(ExpenseSalaries)
    private readonly expenseSalariesRepository: Repository<ExpenseSalaries>,

    @InjectRepository(Purchases)
    private readonly purchasesRepository: Repository<Purchases>,

    @InjectRepository(Returns)
    private readonly returnsRepository: Repository<Returns>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getAllExapsesSallary(filter: FiltersDashboredDto) {
    return await this.expenseSalariesRepository
      .createQueryBuilder("expenseSalaries")
      .select("SUM(expenseSalaries.cost)", "totalCost")
      .where("expenseSalaries.cost > 0")
      .andWhere("expenseSalaries.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
      .getRawOne();
  }

  async getAllExapsesPlace(filter: FiltersDashboredDto) {
    return await this.expensePlaceChildRepository
      .createQueryBuilder("expensePlace")
      .select("SUM(expensePlace.cost)", "totalCost")
      .where("expensePlace.cost > 0")
      .andWhere("expensePlace.created_at BETWEEN :startFrom AND :startTo", {
        startFrom: filter.start_date,
        startTo: filter.end_date,
      })
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
