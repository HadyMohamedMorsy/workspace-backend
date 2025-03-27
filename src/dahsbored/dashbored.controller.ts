import { Body, Controller, Post, Req } from "@nestjs/common";
import { DahboredService } from "./dahsbored.service";
import { FiltersDashboredDto } from "./dto/filter-dashbored.dto";

@Controller("dashboard")
export class DashboredController {
  constructor(private readonly dashboredService: DahboredService) {}

  @Post("analytics")
  async getAnalytics(@Body() filterQueryDto: FiltersDashboredDto, @Req() req: Request) {
    const user = req["userData"];
    const allowedRoles = ["founder", "technical-support", "general-manager", "accountant"];
    const hasAccess = allowedRoles.includes(user.role);

    const metrics = await this.handleMetricsBySlug(filterQueryDto, hasAccess, filterQueryDto.slug);
    return metrics;
  }

  // Helper method to create metric arrays
  private createMetrics(items: Array<[string, number]>, icon: string) {
    return items.map(([title, value]) => ({
      title,
      value: value || 0,
      icon,
    }));
  }

  private async handleMetricsBySlug(
    filterQueryDto: FiltersDashboredDto,
    hasAccess: boolean,
    slug: string,
  ) {
    switch (slug) {
      case "clients":
        return this.handleClientsMetrics(filterQueryDto);
      case "salaries":
        return this.handleSalaryMetrics(filterQueryDto, hasAccess);
      case "expenses":
        return this.handleExpenseMetrics(filterQueryDto, hasAccess);
      case "revenue-place":
        return this.handleRevenueMetrics(filterQueryDto, hasAccess);
      case "purshases":
        return this.handlePurshasesMetrics(filterQueryDto, hasAccess);
      case "returns":
        return this.handleReturnsMetrics(filterQueryDto, hasAccess);
      case "order_count":
        return this.handleCountOrderMetrics(filterQueryDto, hasAccess);
      case "order_total":
        return this.handleTotalOrderMetrics(filterQueryDto);
      case "total_hours":
        return this.handleTotalHoursMetrics(filterQueryDto, hasAccess);
      case "revenue_deals":
        return this.handleRevenueDealsMetrics(filterQueryDto, hasAccess);
      case "revenue_packages":
        return this.handleRevenuePackageMetrics(filterQueryDto, hasAccess);
      case "revenue_shared":
        return this.handleRevenueSharedMetrics(filterQueryDto, hasAccess);
      case "revenue_deskarea":
        return this.handleRevenueDeskAreaMetrics(filterQueryDto, hasAccess);
      case "revenue_rooms":
        return this.handleRevenueRoomsMetrics(filterQueryDto, hasAccess);
      case "revenue_membership":
        return this.handleRevenueMemberShipMetrics(filterQueryDto, hasAccess);
      case "offers":
        return this.handleTotalOffersMetrics(filterQueryDto, hasAccess);
      default:
        return this.handleClientsMetrics(filterQueryDto);
    }
  }

  private async handleClientsMetrics(filterQueryDto: FiltersDashboredDto) {
    const [
      existAllClientResults,
      getAllClientsRoomsActive,
      getAllExistClientDeskareaActive,
      getAllExistClientSharedActive,
      getAllClientsRoomsCompleted,
      getAllExistClientDeskareaCompleted,
      getAllExistClientSharedCompleted,
      getAllClientsRoomsCancelled,
      getAllExistClientDeskareaCancelled,
      getAllExistClientSharedCancelled,
    ] = await Promise.all([
      this.dashboredService.getAllExistClient(filterQueryDto),
      this.dashboredService.getAllClientsRoomsActive(filterQueryDto),
      this.dashboredService.getAllExistClientDeskareaActive(filterQueryDto),
      this.dashboredService.getAllExistClientSharedActive(filterQueryDto),
      this.dashboredService.getAllClientsRoomsCompleted(filterQueryDto),
      this.dashboredService.getAllExistClientDeskareaCompleted(filterQueryDto),
      this.dashboredService.getAllExistClientSharedCompleted(filterQueryDto),
      this.dashboredService.getAllClientsRoomsCancelled(filterQueryDto),
      this.dashboredService.getAllExistClientDeskareaCancelled(filterQueryDto),
      this.dashboredService.getAllExistClientSharedCancelled(filterQueryDto),
    ]);

    return this.createMetrics(
      [
        ["Total All Who is In", existAllClientResults?.total || 0],
        ["Who is In Rooms", getAllClientsRoomsActive?.total || 0],
        ["Who is In Deskarea", getAllExistClientDeskareaActive?.total || 0],
        ["Who is In Shared", getAllExistClientSharedActive?.total || 0],
        ["Count Rooms Completed", getAllClientsRoomsCompleted?.total || 0],
        ["Count Deskarea Completed", getAllExistClientDeskareaCompleted?.total || 0],
        ["Count Shared Completed", getAllExistClientSharedCompleted?.total || 0],
        ["Count Rooms Cancelled", getAllClientsRoomsCancelled?.total || 0],
        ["Count Deskarea Cancelled", getAllExistClientDeskareaCancelled?.total || 0],
        ["Count Shared Cancelled", getAllExistClientSharedCancelled?.total || 0],
      ],
      "pi pi-users",
    );
  }

  private async handleSalaryMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];

    const [totalInternalSallary, totalExternalSallary, totalExpanses] = await Promise.all([
      this.dashboredService.getAllExapsesInternalSallary(filterQueryDto),
      this.dashboredService.getAllExapsesExternalSallary(filterQueryDto),
      this.dashboredService.getAllExapsesPlace(filterQueryDto),
    ]);

    return this.createMetrics(
      [
        ["Total Salary internal salaries", totalInternalSallary?.totalCost || 0],
        ["Total Salary external salaries", totalExternalSallary?.totalCost || 0],
        ["Total Expenses Cost", totalExpanses?.totalCost || 0],
      ],
      "pi pi-wallet",
    );
  }

  private async handleExpenseMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];
    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    const expensesResults = await Promise.all([
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
    ]);

    return this.createMetrics(
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
    );
  }

  private async handleRevenueMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];
    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    const revenueResults = await Promise.all([
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
    ]);

    return this.createMetrics(
      [
        ["Total virtual office income", getValue(revenueResults[0], "totalRevenue")],
        ["Total offices income", getValue(revenueResults[1], "totalRevenue")],
        ["Total stores income", getValue(revenueResults[2], "totalRevenue")],
        ["Total print income", getValue(revenueResults[3], "totalRevenue")],
        ["Total locker income", getValue(revenueResults[4], "totalRevenue")],
        ["Total extra internet income", getValue(revenueResults[5], "totalRevenue")],
        ["Total courses income", getValue(revenueResults[6], "totalRevenue")],
        ["Total courses net profit", getValue(revenueResults[7], "totalRevenue")],
        ["Total electronic income invoices", getValue(revenueResults[8], "totalRevenue")],
        ["Total electronic expenses invoices", getValue(revenueResults[9], "totalRevenue")],
      ],
      "pi pi-money-bill",
    );
  }

  private async handlePurshasesMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];

    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    const [totalCountPurshase, totalPurshase] = await Promise.all([
      this.dashboredService.getAllCountPurshases(filterQueryDto),
      this.dashboredService.getTotalPurshases(filterQueryDto),
    ]);

    return this.createMetrics(
      [
        ["All Count Purchase", getValue(totalCountPurshase, "count")],
        ["All Purchase", getValue(totalPurshase, "total")],
      ],
      "pi pi-wallet",
    );
  }

  private async handleReturnsMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];
    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    const [totalCountReturns, totalReturns] = await Promise.all([
      this.dashboredService.getAllCountReturns(filterQueryDto),
      this.dashboredService.getTotalReturns(filterQueryDto),
    ]);

    return this.createMetrics(
      [
        ["All Count Purchase", getValue(totalCountReturns, "count")],
        ["All Returns", getValue(totalReturns, "total")],
      ],
      "pi pi-wallet",
    );
  }

  private async handleCountOrderMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];
    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    const orderCounts = await Promise.all([
      this.dashboredService.getCountPaidOrders(filterQueryDto),
      this.dashboredService.getCountCostOrders(filterQueryDto),
      this.dashboredService.getCountFreeOrders(filterQueryDto),
      this.dashboredService.getCountHoldOrders(filterQueryDto),
    ]);

    return this.createMetrics(
      [
        ["Count Orders Paid", getValue(orderCounts[0], "count")],
        ["Count Orders Cost", getValue(orderCounts[1], "count")],
        ["Count Orders Free", getValue(orderCounts[2], "count")],
        ["Count Orders Hold", getValue(orderCounts[3], "count")],
      ],
      "pi pi-inbox",
    );
  }

  private async handleTotalOrderMetrics(filterQueryDto: FiltersDashboredDto) {
    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    const orderTotals = await Promise.all([
      this.dashboredService.getTotalPaidOrders(filterQueryDto),
      this.dashboredService.getTotalCostOrders(filterQueryDto),
      this.dashboredService.getTotalHoldOrders(filterQueryDto),
    ]);

    const totalOrderPrice = Promise.all([
      this.dashboredService.getTotalOrderPriceOrders(filterQueryDto),
    ]);

    return this.createMetrics(
      [
        ["All Orders Paid", getValue(orderTotals[0], "total")],
        ["All Orders Cost", getValue(orderTotals[1], "total")],
        ["All Orders Hold", getValue(orderTotals[2], "total")],
        ["All Amount Orders Kitchen", getValue(totalOrderPrice, "total")],
        [
          "All Orders Kitchen",
          getValue(orderTotals[0], "total") + getValue(orderTotals[1], "total"),
        ],
        ,
      ],
      "pi pi-inbox",
    );
  }

  private async handleTotalHoursMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];
    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    const [totalCompletedHourShared, totalCompletedHourDesk, totalCompletedHourRooms] =
      await Promise.all([
        this.dashboredService.getAllTotalHourSharedCompleted(filterQueryDto),
        this.dashboredService.getAllTotalHourDeskareaCompleted(filterQueryDto),
        this.dashboredService.getAllTotalHourReservationRoomCompleted(filterQueryDto),
      ]);

    return this.createMetrics(
      [
        ["All Completed Hours Shared", getValue(totalCompletedHourShared, "totalHour")],
        ["All Completed Hours Deskarea", getValue(totalCompletedHourDesk, "totalHour")],
        ["All Completed Hours Rooms", getValue(totalCompletedHourRooms, "totalHour")],
      ],
      "pi pi-box",
    );
  }

  private async handleRevenueDealsMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];
    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    const [totalCompletedDeal, totalCancelledDeal, totalActiveDeal] = await Promise.all([
      this.dashboredService.getAllTotalDeal(filterQueryDto),
      this.dashboredService.getAllTotalCancelledDeal(filterQueryDto),
      this.dashboredService.getAllTotalActiveDeal(filterQueryDto),
    ]);

    return this.createMetrics(
      [
        ["All Completed Deal Revenue", getValue(totalCompletedDeal, "totalRevenue")],
        ["All Cancelled Deal", getValue(totalCancelledDeal, "totalRevenue")],
        ["All Active Deal", getValue(totalActiveDeal, "totalRevenue")],
      ],
      "pi pi-box",
    );
  }

  private async handleRevenuePackageMetrics(
    filterQueryDto: FiltersDashboredDto,
    hasAccess: boolean,
  ) {
    if (!hasAccess) return [];
    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    const [totalCompletedPackages, totalCancelledPackages, totalActivePackages] = await Promise.all(
      [
        this.dashboredService.getAllTotalPackages(filterQueryDto),
        this.dashboredService.getAllTotalCancelledPackages(filterQueryDto),
        this.dashboredService.getAllTotalActivePackages(filterQueryDto),
      ],
    );

    return this.createMetrics(
      [
        ["All Completed Packages Revenue", getValue(totalCompletedPackages, "totalRevenue")],
        ["All Cancelled Packages", getValue(totalCancelledPackages, "totalRevenue")],
        ["All Active Packages", getValue(totalActivePackages, "totalRevenue")],
      ],
      "pi pi-box",
    );
  }

  private async handleRevenueSharedMetrics(
    filterQueryDto: FiltersDashboredDto,
    hasAccess: boolean,
  ) {
    if (!hasAccess) return [];
    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    const [totalCompletedShared, totalCancelledShared, totalActiveShared] = await Promise.all([
      this.dashboredService.getAllTotalShared(filterQueryDto),
      this.dashboredService.getAllTotalCancelledShared(filterQueryDto),
      this.dashboredService.getAllTotalActiveShared(filterQueryDto),
    ]);

    return this.createMetrics(
      [
        ["All Completed Shared Revenue", getValue(totalCompletedShared, "totalRevenue")],
        ["All Cancelled Shared", getValue(totalCancelledShared, "totalRevenue")],
        ["All Active Shared", getValue(totalActiveShared, "totalRevenue")],
      ],
      "pi pi-box",
    );
  }

  private async handleRevenueDeskAreaMetrics(
    filterQueryDto: FiltersDashboredDto,
    hasAccess: boolean,
  ) {
    if (!hasAccess) return [];
    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    const [totalCompletedDeskArea, totalCancelledDeskArea, totalActiveDeskArea] = await Promise.all(
      [
        this.dashboredService.getAllTotalDeskArea(filterQueryDto),
        this.dashboredService.getAllTotalCancelledDeskArea(filterQueryDto),
        this.dashboredService.getAllTotalActiveDeskArea(filterQueryDto),
      ],
    );

    return this.createMetrics(
      [
        ["All Completed Desk Area Revenue", getValue(totalCompletedDeskArea, "totalRevenue")],
        ["All Cancelled Desk Area", getValue(totalCancelledDeskArea, "totalRevenue")],
        ["All Active Desk Area", getValue(totalActiveDeskArea, "totalRevenue")],
      ],
      "pi pi-box",
    );
  }

  private async handleRevenueRoomsMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];
    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    const [
      totalCompletedReservationRoom,
      totalCancelledReservationRoom,
      totalActiveReservationRoom,
    ] = await Promise.all([
      this.dashboredService.getAllTotalReservationRoom(filterQueryDto),
      this.dashboredService.getAllTotalCancelledReservationRoom(filterQueryDto),
      this.dashboredService.getAllTotalActiveReservationRoom(filterQueryDto),
    ]);

    return this.createMetrics(
      [
        [
          "All Completed Reservation Room Revenue",
          getValue(totalCompletedReservationRoom, "totalRevenue"),
        ],
        ["All Cancelled Reservation Room", getValue(totalCancelledReservationRoom, "totalRevenue")],
        ["All Active Reservation Room", getValue(totalActiveReservationRoom, "totalRevenue")],
      ],
      "pi pi-box",
    );
  }

  private async handleRevenueMemberShipMetrics(
    filterQueryDto: FiltersDashboredDto,
    hasAccess: boolean,
  ) {
    if (!hasAccess) return [];
    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    const [totalCompletedMembership, totalCancelledMembership, totalActiveMembership] =
      await Promise.all([
        this.dashboredService.getAllTotalMemberShip(filterQueryDto),
        this.dashboredService.getAllTotalCancelledMemberShip(filterQueryDto),
        this.dashboredService.getAllTotalActiveMemberShip(filterQueryDto),
      ]);

    return this.createMetrics(
      [
        ["All Completed Membership Revenue", getValue(totalCompletedMembership, "totalRevenue")],
        ["All Cancelled Membership", getValue(totalCancelledMembership, "totalRevenue")],
        ["All Active Membership", getValue(totalActiveMembership, "totalRevenue")],
      ],
      "pi pi-box",
    );
  }

  private async handleTotalOffersMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];
    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    const [totalOffer] = await Promise.all([
      this.dashboredService.getAllTotalOffer(filterQueryDto),
    ]);

    return this.createMetrics([["All Offers", getValue(totalOffer, "count")]], "pi pi-box");
  }
}
