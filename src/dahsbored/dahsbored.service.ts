// import { Injectable } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { endOfMonth, startOfMonth } from "date-fns";
// import { Cost } from "src/costs/costs.entity";
// import { Customer } from "src/customer/customer.entity";
// import { Order, Product } from "src/orders/order.entity";
// import { Repository } from "typeorm";

// @Injectable()
// export class DahboredService {
//   constructor(
//     @InjectRepository(Product)
//     private readonly productRepository: Repository<Product>,

//     @InjectRepository(Order)
//     private readonly orderRepository: Repository<Order>,

//     @InjectRepository(Cost)
//     private readonly costRepository: Repository<Cost>,

//     @InjectRepository(Customer)
//     private readonly customerRepository: Repository<Customer>,
//   ) {}

//   // Get products with store > 0
//   async getProductsInStock() {
//     return await this.productRepository
//       .createQueryBuilder("product")
//       .select("SUM(product.store)", "totalStock")
//       .where("product.store > 0")
//       .getRawOne();
//   }

//   // Get order summary by status for the current month
//   async getOrdersSummary() {
//     const rawResults = await this.orderRepository
//       .createQueryBuilder("order")
//       .select("order.status", "status")
//       .addSelect("COUNT(*)", "count")
//       .groupBy("order.status")
//       .getRawMany();

//     const allStatuses = ["pending", "deliveried", "returns"];

//     // Map results to ensure all statuses are present
//     const ordersSummary = allStatuses.map(status => {
//       const found = rawResults.find(result => result.status === status);
//       return {
//         status,
//         count: found ? parseInt(found.count, 10) : 0,
//       };
//     });

//     return ordersSummary;
//   }

//   // Example: Get total revenue for the current month
//   async getMonthlyRevenue() {
//     const currentMonthStart = startOfMonth(new Date());
//     const currentMonthEnd = endOfMonth(new Date());

//     return this.orderRepository
//       .createQueryBuilder("order")
//       .select("SUM(order.total_order)", "totalRevenue")
//       .where("order.status = :status", { status: "deliveried" })
//       .andWhere("order.created_at BETWEEN :start AND :end", {
//         start: currentMonthStart,
//         end: currentMonthEnd,
//       })
//       .getRawOne();
//   }

//   async getTotalCostsThisMonth() {
//     const currentMonthStart = startOfMonth(new Date());
//     const currentMonthEnd = endOfMonth(new Date());

//     return this.costRepository
//       .createQueryBuilder("cost")
//       .select([
//         "SUM(cost.transportation)",
//         "SUM(cost.packaging)",
//         "SUM(cost.advertising_markting)",
//         "SUM(cost.damaged)",
//         "SUM(cost.salaries)",
//       ])
//       .addSelect(
//         "SUM(cost.transportation + cost.packaging + cost.advertising_markting + cost.damaged + cost.salaries)",
//         "total",
//       )
//       .where("cost.created_at BETWEEN :start AND :end", {
//         start: currentMonthStart,
//         end: currentMonthEnd,
//       })
//       .getRawOne();
//   }

//   async getCustomerCountWithOrdersThisMonth() {
//     const currentMonthStart = startOfMonth(new Date());
//     const currentMonthEnd = endOfMonth(new Date());

//     return this.customerRepository
//       .createQueryBuilder("customer")
//       .select("COUNT(DISTINCT customer.id)", "customerCount")
//       .innerJoin("customer.orders", "order") // Ensure customers with orders only
//       .where("order.created_at BETWEEN :start AND :end", {
//         start: currentMonthStart,
//         end: currentMonthEnd,
//       })
//       .getRawOne();
//   }
// }
