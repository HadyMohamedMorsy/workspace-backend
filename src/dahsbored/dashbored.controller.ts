// import { Controller, Get } from "@nestjs/common";
// import { DahboredService } from "./dahsbored.service";

// @Controller("dashboard")
// export class DashboredController {
//   constructor(private readonly dashboredService: DahboredService) {}

//   @Get("analytics")
//   async getAnalytics() {
//     // Call all analysis methods
//     const productsInStock = await this.dashboredService.getProductsInStock();
//     const ordersSummary = await this.dashboredService.getOrdersSummary();
//     const monthlyRevenue = await this.dashboredService.getMonthlyRevenue();
//     const monthlyCost = await this.dashboredService.getTotalCostsThisMonth();
//     const monthlyCustomer = await this.dashboredService.getCustomerCountWithOrdersThisMonth();
//     // Return combined results
//     return [
//       {
//         title: "اجمالي المنتجات في المحزن",
//         value: productsInStock.totalStock ?? 0,
//         icon: "pi pi-home",
//       },
//       {
//         title: "اجمالي المنتجات المنتظره",
//         value: ordersSummary[0].count ?? 0,
//         icon: "pi pi-hourglass",
//       },
//       {
//         title: "اجمالي المنتجات اللي استلمت للعميل",
//         value: ordersSummary[1].count ?? 0,
//         icon: "pi pi-send",
//       },
//       {
//         title: "اجمالي المنتجات المرتجعات",
//         value: ordersSummary[2].count ?? 0,
//         icon: "pi pi-angle-double-left",
//       },
//       {
//         title: "اجمالي التكاليف هذا الشهر",
//         value: monthlyCost.total ?? 0,
//         icon: "pi pi-money-bill",
//       },
//       {
//         title: "عدد العملاء اللي طلبو طلب في هذا الشهر",
//         value: monthlyCustomer.customerCount ?? 0,
//         icon: "pi pi-user",
//       },
//       {
//         title: "اجمالي الارباح هذا الشهر",
//         value: monthlyRevenue.totalRevenue ?? 0,
//         icon: "pi pi-money-bill",
//       },
//     ];
//   }
// }
