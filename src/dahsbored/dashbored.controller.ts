import { Body, Controller, Post, Req, UseInterceptors } from "@nestjs/common";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { DahboredService } from "./dahsbored.service";
import { FiltersDashboredDto } from "./dto/filter-dashbored.dto";

@Controller("dashboard")
export class DashboredController {
  constructor(private readonly dashboredService: DahboredService) {}

  @Post("analytics")
  @UseInterceptors(CachingInterceptor)
  async getAnalytics(@Body() filterQueryDto: FiltersDashboredDto, @Req() req: Request) {
    const user = req["user"];
    const allowedRoles = ["founder", "general-manager", "accountant"];
    const hasAccess = allowedRoles.includes(user.role);

    const [
      // Salary related
      [totalInternalSallary, totalExternalSallary, totalExpanses],

      // Expenses related
      expensesResults,

      // revenueResults related
      revenueResults,

      // Purchase/Return related
      [totalCountPurshase, totalCountReturns, totalPurshase, totalReturns],

      // Orders related
      orderCounts,
      orderTotals,

      // Order price
      [totalOrderPrice],
    ] = await Promise.all([
      // Salary group
      Promise.all([
        this.dashboredService.getAllExapsesInternalSallary(filterQueryDto),
        this.dashboredService.getAllExapsesExternalSallary(filterQueryDto),
        this.dashboredService.getAllExapsesPlace(filterQueryDto),
      ]),

      // Expenses group
      Promise.all([
        this.dashboredService.getAllExapsesInsurance(filterQueryDto),
        this.dashboredService.getAllExapsesSystemFees(filterQueryDto),
        this.dashboredService.getAllExapsesRents(filterQueryDto),
        this.dashboredService.getAllExapsesElectricityBills(filterQueryDto),
        this.dashboredService.getAllExapsesBonuses(filterQueryDto),
        this.dashboredService.getAllExapsesAssetsPurchased(filterQueryDto),
        this.dashboredService.getAllExapsesKitchenCost(filterQueryDto),
        this.dashboredService.getAllExapsesCoursesCost(filterQueryDto),
        this.dashboredService.getAllExapsesCharteredAccountantFees(filterQueryDto),
        this.dashboredService.getAllExapsesLoans(filterQueryDto),
        this.dashboredService.getAllExapsesOther(filterQueryDto),
      ]),

      // Revenue group
      Promise.all([
        this.dashboredService.getAllRevenueVirtualOfficeIncome(filterQueryDto),
        this.dashboredService.getAllRevenueOfficesIncome(filterQueryDto),
        this.dashboredService.getAllRevenueStoresIncome(filterQueryDto),
        this.dashboredService.getAllRevenuePrintIncome(filterQueryDto),
        this.dashboredService.getAllRevenueLockerIncome(filterQueryDto),
        this.dashboredService.getAllRevenueExtraInternetIncome(filterQueryDto),
        this.dashboredService.getAllRevenueCoursesIncome(filterQueryDto),
        this.dashboredService.getAllRevenueCoursesNetProfit(filterQueryDto),
        this.dashboredService.getAllRevenueElectronicIncomeInvoices(filterQueryDto),
        this.dashboredService.getAllRevenueElectronicExpensesInvoices(filterQueryDto),
        this.dashboredService.getAllRevenueOther(filterQueryDto),
      ]),

      // Purchase/Return group
      Promise.all([
        this.dashboredService.getAllCountPurshases(filterQueryDto),
        this.dashboredService.getAllCountReturns(filterQueryDto),
        this.dashboredService.getTotalPurshases(filterQueryDto),
        this.dashboredService.getTotalReturns(filterQueryDto),
      ]),

      // Order counts group
      Promise.all([
        this.dashboredService.getCountPaidOrders(filterQueryDto),
        this.dashboredService.getCountCostOrders(filterQueryDto),
        this.dashboredService.getCountFreeOrders(filterQueryDto),
        this.dashboredService.getCountHoldOrders(filterQueryDto),
      ]),

      // Order totals group
      Promise.all([
        this.dashboredService.getTotalPaidOrders(filterQueryDto),
        this.dashboredService.getTotalCostOrders(filterQueryDto),
        this.dashboredService.getTotalHoldOrders(filterQueryDto),
      ]),

      // Order price group
      Promise.all([this.dashboredService.getTotalOrderPriceOrders(filterQueryDto)]),
    ]);

    // Helper function to safely get values
    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    // Structured result construction
    return [
      // Salary section
      ...this.createMetrics(
        [
          ["Total Salary internal salaries", getValue(totalInternalSallary, "totalCost")],
          ["Total Salary external salaries", getValue(totalExternalSallary, "totalCost")],
          ["Total Expenses Cost", getValue(totalExpanses, "totalCost")],
        ],
        "pi pi-wallet",
      ),

      // Expenses section
      ...(hasAccess
        ? this.createMetrics(
            [
              ["Total Insurance Cost", getValue(expensesResults[0], "totalCost")],
              ["Total System Fees Cost", getValue(expensesResults[1], "totalCost")],
              ["Total Rent Cost", getValue(expensesResults[2], "totalCost")],
              ["Total Electricity Bills Cost", getValue(expensesResults[3], "totalCost")],
              ["Total Bonus Cost", getValue(expensesResults[4], "totalCost")],
              ["Total Assets Purchased", getValue(expensesResults[5], "totalCost")],
              ["Total Kitchen Cost", getValue(expensesResults[6], "totalCost")],
              ["Total Courses Cost", getValue(expensesResults[7], "totalCost")],
              ["Total Chartered Accountant Fees", getValue(expensesResults[8], "totalCost")],
              ["Total Loans Cost", getValue(expensesResults[9], "totalCost")],
              ["Total Other Cost", getValue(expensesResults[10], "totalCost")],
            ],
            "pi pi-wallet",
          )
        : []),

      // revenue
      ...(hasAccess
        ? this.createMetrics(
            [
              ["Total virtual office income", getValue(revenueResults[0], "totalRevenue")],
              ["Total offices income", getValue(revenueResults[1], "totalRevenue")],
              ["Total stores income", getValue(revenueResults[3], "totalRevenue")],
              ["Total print income", getValue(revenueResults[4], "totalRevenue")],
              ["Total locker income", getValue(revenueResults[5], "totalRevenue")],
              ["Total extra internet income", getValue(revenueResults[6], "totalRevenue")],
              ["Total courses income", getValue(revenueResults[7], "totalRevenue")],
              ["Total courses net profit", getValue(revenueResults[8], "totalRevenue")],
              ["Total electronic income invoices", getValue(revenueResults[9], "totalRevenue")],
              ["Total electronic expenses invoices", getValue(revenueResults[10], "totalRevenue")],
            ],
            "pi pi-money-bill",
          )
        : []),

      // Purchase/Return section
      ...this.createMetrics(
        [
          ["Total Count Purchase", getValue(totalCountPurshase, "count")],
          ["Total Count Returns", getValue(totalCountReturns, "count")],
          ["Total Purchase", getValue(totalPurshase, "total")],
          ["Total Returns", getValue(totalReturns, "total")],
        ],
        "pi pi-barcode",
      ),

      // Order counts
      ...this.createMetrics(
        [
          ["Count Orders Paid", getValue(orderCounts[0], "count")],
          ["Count Orders Cost", getValue(orderCounts[1], "count")],
          ["Count Orders Free", getValue(orderCounts[2], "count")],
          ["Count Orders Hold", getValue(orderCounts[3], "count")],
        ],
        "pi pi-inbox",
      ),

      // Order totals
      ...this.createMetrics(
        [
          ["Total Orders Paid", getValue(orderTotals[0], "total")],
          ["Total Orders Cost", getValue(orderTotals[1], "total")],
          ["Total Orders Hold", getValue(orderTotals[2], "total")],
          ["Amount Orders Kitchen", getValue(totalOrderPrice, "total")],
          [
            "Total Orders Kitchen",
            getValue(orderTotals[0], "total") + getValue(orderTotals[1], "total"),
          ],
        ],
        "pi pi-inbox",
      ),
    ];
  }

  // Helper method to create metric arrays
  private createMetrics(items: Array<[string, number]>, icon: string) {
    return items.map(([title, value]) => ({
      title,
      value: value || 0,
      icon,
    }));
  }
}
