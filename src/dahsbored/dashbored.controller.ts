import { Body, Controller, Post, Req } from "@nestjs/common";
import { PaymentMethod, TypeOrder } from "src/shared/enum/global-enum";
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
      case "cash-today":
        return this.handleAllRevenueMetrics(filterQueryDto);
      case "total-today-all":
        return this.handleAllRevenueMetricsAllPaymentMethods(filterQueryDto);
      case "cash-today-visa":
        return this.handleAllRevenueMetricsVisa(filterQueryDto);
      case "cash-today-instapay":
        return this.handleAllRevenueMetricsInstapay(filterQueryDto);
      case "cash-today-vodafone":
        return this.handleAllRevenueMetricsVodafone(filterQueryDto);
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
      case "deskarea_payment_method":
        return this.getDeskAreaPaymentMetrics(filterQueryDto, hasAccess);
      case "reservation_room_payment_method":
        return this.getReservationRoomPaymentMetrics(filterQueryDto, hasAccess);
      case "package_payment_method":
        return this.getAssignesPackagesPaymentMetrics(filterQueryDto, hasAccess);
      case "membership_payment_method":
        return this.getMembershipPaymentMetrics(filterQueryDto, hasAccess);
      case "shared_payment_method":
        return this.getSharedMetrics(filterQueryDto, hasAccess);
      case "order_payment_method":
        return this.getOrderMetrics(filterQueryDto, hasAccess);
      case "deals_payment_methods":
        return this.getDealsPaymentMetrics(filterQueryDto, hasAccess);
      case "offers":
        return this.handleTotalOffersMetrics(filterQueryDto, hasAccess);
      default:
        return this.handleClientsMetrics(filterQueryDto);
    }
  }

  private async handleAllRevenueMetrics(filterQueryDto: FiltersDashboredDto) {
    const revenueData = await this.dashboredService.getAllRevenueToday(filterQueryDto);

    return this.createMetrics(
      [
        ["Total Cash", revenueData?.total || 0],
        ["Deals Cash", revenueData?.details.dealsRevenue || 0],
        ["Shared Cash", revenueData?.details.sharedRevenue || 0],
        ["Desk Area Cash", revenueData?.details.deskAreaRevenue || 0],
        ["Reservation Room Cash", revenueData?.details.reservationRoomRevenue || 0],
        ["Packages Cash", revenueData?.details.packagesRevenue || 0],
        ["Membership Cash", revenueData?.details.membershipRevenue || 0],
        ["Orders Paid Cash", revenueData?.details.orderPaid || 0],
        ["Orders Cost Cash", revenueData?.details.orderCost || 0],
        ["Revenue  Cash", revenueData?.details.revenueChildSum || 0],
        ["Expenses Cash", revenueData?.details.expenseSum || 0],
        ["Returns Cash", revenueData?.details.returnsSum || 0],
        ["Purchases Cash", revenueData?.details.purchasesSum || 0],
      ],
      "pi pi-money-bill",
    );
  }

  private async handleAllRevenueMetricsAllPaymentMethods(filterQueryDto: FiltersDashboredDto) {
    const revenueData =
      await this.dashboredService.getAllRevenueTodayAllPaymentMethods(filterQueryDto);
    return this.createMetrics(
      [
        ["Total All Payment Methods", revenueData?.total || 0],
        ["Deals All Payment Methods", revenueData?.details.dealsRevenue || 0],
        ["Shared All Payment Methods", revenueData?.details.sharedRevenue || 0],
        ["Desk Area All Payment Methods", revenueData?.details.deskAreaRevenue || 0],
        ["Reservation Room All Payment Methods", revenueData?.details.reservationRoomRevenue || 0],
        ["Packages All Payment Methods", revenueData?.details.packagesRevenue || 0],
        ["Membership All Payment Methods", revenueData?.details.membershipRevenue || 0],
        ["Orders Paid All Payment Methods", revenueData?.details.orderPaid || 0],
        ["Orders Cost All Payment Methods", revenueData?.details.orderCost || 0],
        ["Revenue All Payment Methods", revenueData?.details.revenueChildSum || 0],
        ["Expenses All Payment Methods", revenueData?.details.expenseSum || 0],
        ["Purchases All Payment Methods", revenueData?.details.purchasesSum || 0],
        ["Returns All Payment Methods", revenueData?.details.returnsSum || 0],
      ],
      "pi pi-credit-card",
    );
  }

  private async handleAllRevenueMetricsVisa(filterQueryDto: FiltersDashboredDto) {
    const revenueData = await this.dashboredService.getAllRevenueTodayVisa(filterQueryDto);

    return this.createMetrics(
      [
        ["Total Visa", revenueData?.total || 0],
        ["Deals Visa", revenueData?.details.dealsRevenue || 0],
        ["Shared Visa", revenueData?.details.sharedRevenue || 0],
        ["Desk Area Visa", revenueData?.details.deskAreaRevenue || 0],
        ["Reservation Room Visa", revenueData?.details.reservationRoomRevenue || 0],
        ["Packages Visa", revenueData?.details.packagesRevenue || 0],
        ["Membership Visa", revenueData?.details.membershipRevenue || 0],
        ["Orders Paid Visa", revenueData?.details.orderPaid || 0],
        ["Orders Cost Visa", revenueData?.details.orderCost || 0],
        ["Revenue Visa", revenueData?.details.revenueChildSum || 0],
        ["Expenses Visa", revenueData?.details.expenseSum || 0],
      ],
      "pi pi-credit-card",
    );
  }

  private async handleAllRevenueMetricsInstapay(filterQueryDto: FiltersDashboredDto) {
    const revenueData = await this.dashboredService.getAllRevenueTodayInstapay(filterQueryDto);

    return this.createMetrics(
      [
        ["Total Instapay", revenueData?.total || 0],
        ["Deals Instapay", revenueData?.details.dealsRevenue || 0],
        ["Shared Instapay", revenueData?.details.sharedRevenue || 0],
        ["Desk Area Instapay", revenueData?.details.deskAreaRevenue || 0],
        ["Reservation Room Instapay", revenueData?.details.reservationRoomRevenue || 0],
        ["Packages Instapay", revenueData?.details.packagesRevenue || 0],
        ["Membership Instapay", revenueData?.details.membershipRevenue || 0],
        ["Orders Paid Instapay", revenueData?.details.orderPaid || 0],
        ["Orders Cost Instapay", revenueData?.details.orderCost || 0],
        ["Revenue Instapay", revenueData?.details.revenueChildSum || 0],
        ["Expenses Instapay", revenueData?.details.expenseSum || 0],
      ],
      "pi pi-mobile",
    );
  }

  private async handleAllRevenueMetricsVodafone(filterQueryDto: FiltersDashboredDto) {
    const revenueData = await this.dashboredService.getAllRevenueTodayVodafoneCash(filterQueryDto);

    return this.createMetrics(
      [
        ["Total Vodafone Cash", revenueData?.total || 0],
        ["Deals Vodafone Cash", revenueData?.details.dealsRevenue || 0],
        ["Shared Vodafone Cash", revenueData?.details.sharedRevenue || 0],
        ["Desk Area Vodafone Cash", revenueData?.details.deskAreaRevenue || 0],
        ["Reservation Room Vodafone Cash", revenueData?.details.reservationRoomRevenue || 0],
        ["Packages Vodafone Cash", revenueData?.details.packagesRevenue || 0],
        ["Membership Vodafone Cash", revenueData?.details.membershipRevenue || 0],
        ["Orders Paid Vodafone Cash", revenueData?.details.orderPaid || 0],
        ["Orders Cost Vodafone Cash", revenueData?.details.orderCost || 0],
        ["Revenue Vodafone Cash", revenueData?.details.revenueChildSum || 0],
        ["Expenses Vodafone Cash", revenueData?.details.expenseSum || 0],
      ],
      "pi pi-wallet",
    );
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
      this.dashboredService.getAllExapsesPlaceOther(filterQueryDto),
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
      this.dashboredService.getAllAnotherRevenue(filterQueryDto),
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
        ["Total onther Revenue", getValue(revenueResults[10], "totalRevenue")],
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

    // Get revenue by payment method and order type
    const [
      // Cash orders by type
      cashPaid,
      cashCost,
      cashHold,
      cashFree,
      // Instapay orders by type
      instapayPaid,
      instapayCost,
      instapayHold,
      instapayFree,
      // Visa orders by type
      visaPaid,
      visaCost,
      visaHold,
      visaFree,
      // Vodafone orders by type
      vodafonePaid,
      vodafoneCost,
      vodafoneHold,
      vodafoneFree,
    ] = await Promise.all([
      // Cash orders
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.Cach,
        TypeOrder.PAID,
      ),
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.Cach,
        TypeOrder.COST,
      ),
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.Cach,
        TypeOrder.HOLD,
      ),
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.Cach,
        TypeOrder.FREE,
      ),

      // Instapay orders
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.Instapay,
        TypeOrder.PAID,
      ),
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.Instapay,
        TypeOrder.COST,
      ),
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.Instapay,
        TypeOrder.HOLD,
      ),
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.Instapay,
        TypeOrder.FREE,
      ),

      // Visa orders
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.Visa,
        TypeOrder.PAID,
      ),
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.Visa,
        TypeOrder.COST,
      ),
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.Visa,
        TypeOrder.HOLD,
      ),
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.Visa,
        TypeOrder.FREE,
      ),

      // Vodafone orders
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.VodafoneCach,
        TypeOrder.PAID,
      ),
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.VodafoneCach,
        TypeOrder.COST,
      ),
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.VodafoneCach,
        TypeOrder.HOLD,
      ),
      this.dashboredService.getOrderRevenueByType(
        filterQueryDto,
        PaymentMethod.VodafoneCach,
        TypeOrder.FREE,
      ),
    ]);

    // Calculate totals by payment method
    const cashTotal =
      +getValue(cashPaid, "totalRevenue") +
      +getValue(cashCost, "totalRevenue") +
      +getValue(cashHold, "totalRevenue") +
      +getValue(cashFree, "totalRevenue");
    const instapayTotal =
      +getValue(instapayPaid, "totalRevenue") +
      +getValue(instapayCost, "totalRevenue") +
      +getValue(instapayHold, "totalRevenue") +
      +getValue(instapayFree, "totalRevenue");
    const visaTotal =
      +getValue(visaPaid, "totalRevenue") +
      +getValue(visaCost, "totalRevenue") +
      +getValue(visaHold, "totalRevenue") +
      +getValue(visaFree, "totalRevenue");
    const vodafoneTotal =
      +getValue(vodafonePaid, "totalRevenue") +
      +getValue(vodafoneCost, "totalRevenue") +
      +getValue(vodafoneHold, "totalRevenue") +
      +getValue(vodafoneFree, "totalRevenue");

    // Calculate totals by order type
    const paidTotal =
      +getValue(cashPaid, "totalRevenue") +
      +getValue(instapayPaid, "totalRevenue") +
      +getValue(visaPaid, "totalRevenue") +
      +getValue(vodafonePaid, "totalRevenue");
    const costTotal =
      +getValue(cashCost, "totalRevenue") +
      +getValue(instapayCost, "totalRevenue") +
      +getValue(visaCost, "totalRevenue") +
      +getValue(vodafoneCost, "totalRevenue");
    const holdTotal =
      +getValue(cashHold, "totalRevenue") +
      +getValue(instapayHold, "totalRevenue") +
      +getValue(visaHold, "totalRevenue") +
      +getValue(vodafoneHold, "totalRevenue");
    const freeTotal =
      +getValue(cashFree, "totalRevenue") +
      +getValue(instapayFree, "totalRevenue") +
      +getValue(visaFree, "totalRevenue") +
      +getValue(vodafoneFree, "totalRevenue");

    const totalAllPaymentMethods = +cashTotal + +instapayTotal + +visaTotal + +vodafoneTotal;

    return this.createMetrics(
      [
        // Overall totals
        ["Total All Payment Methods", totalAllPaymentMethods],
        ["Total All Order Types", +paidTotal + +costTotal + +holdTotal + +freeTotal],

        // Payment method breakdowns
        ["Cash Total Revenue", cashTotal],
        ["Vodafone Total Revenue", vodafoneTotal],
        ["Visa Total Revenue", visaTotal],
        ["Instapay Total Revenue", instapayTotal],

        // Order type breakdowns
        ["PAID Orders Total", paidTotal],
        ["COST Orders Total", costTotal],
        ["HOLD Orders Total", holdTotal],
        ["FREE Orders Total", freeTotal],

        // Detailed breakdown by payment method and order type
        ["Cash PAID Orders", getValue(cashPaid, "totalRevenue")],
        ["Cash COST Orders", getValue(cashCost, "totalRevenue")],
        ["Cash HOLD Orders", getValue(cashHold, "totalRevenue")],
        ["Cash FREE Orders", getValue(cashFree, "totalRevenue")],

        ["Vodafone PAID Orders", getValue(vodafonePaid, "totalRevenue")],
        ["Vodafone COST Orders", getValue(vodafoneCost, "totalRevenue")],
        ["Vodafone HOLD Orders", getValue(vodafoneHold, "totalRevenue")],
        ["Vodafone FREE Orders", getValue(vodafoneFree, "totalRevenue")],

        ["Visa PAID Orders", getValue(visaPaid, "totalRevenue")],
        ["Visa COST Orders", getValue(visaCost, "totalRevenue")],
        ["Visa HOLD Orders", getValue(visaHold, "totalRevenue")],
        ["Visa FREE Orders", getValue(visaFree, "totalRevenue")],

        ["Instapay PAID Orders", getValue(instapayPaid, "totalRevenue")],
        ["Instapay COST Orders", getValue(instapayCost, "totalRevenue")],
        ["Instapay HOLD Orders", getValue(instapayHold, "totalRevenue")],
        ["Instapay FREE Orders", getValue(instapayFree, "totalRevenue")],
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

  async getDealsPaymentMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];

    const [cash, vodafone, visa, instapay] = await Promise.all([
      this.dashboredService.getCashRevenueForDeals(filterQueryDto),
      this.dashboredService.getVisaRevenueForDeals(filterQueryDto),
      this.dashboredService.getVodafoneCachRevenueForDeals(filterQueryDto),
      this.dashboredService.getInstapayRevenueForDeals(filterQueryDto),
    ]);

    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    return this.createMetrics(
      [
        ["Cash Deals Revenue", getValue(cash, "totalRevenue")],
        ["Vodafone Deals Revenue", getValue(vodafone, "totalRevenue")],
        ["Visa Deals Revenue", getValue(visa, "totalRevenue")],
        ["Instapay Deals Revenue", getValue(instapay, "totalRevenue")],
      ],
      "pi pi-credit-card",
    );
  }

  async getDeskAreaPaymentMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];

    const [cash, vodafone, visa, instapay] = await Promise.all([
      this.dashboredService.getCashRevenueForDeskAreas(filterQueryDto),
      this.dashboredService.getVodafoneCachRevenueForDeskAreas(filterQueryDto),
      this.dashboredService.getVisaRevenueForDeskAreas(filterQueryDto),
      this.dashboredService.getInstapayRevenueForDeskAreas(filterQueryDto),
    ]);

    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    return this.createMetrics(
      [
        ["Cash Deskarea Revenue", getValue(cash, "totalRevenue")],
        ["Vodafone Deskarea Revenue", getValue(vodafone, "totalRevenue")],
        ["Visa Deskarea Revenue", getValue(visa, "totalRevenue")],
        ["Instapay Deskarea Revenue", getValue(instapay, "totalRevenue")],
      ],
      "pi pi-credit-card",
    );
  }

  async getReservationRoomPaymentMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];

    const [cash, vodafone, visa, instapay] = await Promise.all([
      this.dashboredService.getReservationRoomCashRevenue(filterQueryDto),
      this.dashboredService.getReservationRoomVodafoneRevenue(filterQueryDto),
      this.dashboredService.getReservationRoomVisaRevenue(filterQueryDto),
      this.dashboredService.getReservationRoomInstaRevenue(filterQueryDto),
    ]);

    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    return this.createMetrics(
      [
        ["Cash Reservation Revenue", getValue(cash, "totalRevenue")],
        ["Vodafone Reservation Revenue", getValue(vodafone, "totalRevenue")],
        ["Visa Reservation Revenue", getValue(visa, "totalRevenue")],
        ["Instapay Reservation Revenue", getValue(instapay, "totalRevenue")],
      ],
      "pi pi-home",
    );
  }

  async getAssignesPackagesPaymentMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];

    const [cash, vodafone, visa, instapay] = await Promise.all([
      this.dashboredService.getAssignesPackagesCashRevenue(filterQueryDto),
      this.dashboredService.getAssignesPackagesVodafoneRevenue(filterQueryDto),
      this.dashboredService.getAssignesPackagesVisaRevenue(filterQueryDto),
      this.dashboredService.getAssignesPackagesInstaRevenue(filterQueryDto),
    ]);

    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    return this.createMetrics(
      [
        ["Cash Packages Revenue", getValue(cash, "totalRevenue")],
        ["Vodafone Packages Revenue", getValue(vodafone, "totalRevenue")],
        ["Visa Packages Revenue", getValue(visa, "totalRevenue")],
        ["Instapay Packages Revenue", getValue(instapay, "totalRevenue")],
      ],
      "pi pi-briefcase",
    );
  }

  async getMembershipPaymentMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];

    const [cash, instapay, visa, vodafone] = await Promise.all([
      this.dashboredService.getAssignesMemberShipCachRevenue(filterQueryDto),
      this.dashboredService.getAssignesMemberShipVisaRevenue(filterQueryDto),
      this.dashboredService.getAssignesMemberShipInstaRevenue(filterQueryDto),
      this.dashboredService.getAssignesMemberShipVodafoneRevenue(filterQueryDto),
    ]);

    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    return this.createMetrics(
      [
        ["Cash Membership Revenue", getValue(cash, "totalRevenue")],
        ["Vodafone Membership Revenue", getValue(vodafone, "totalRevenue")],
        ["Visa Membership Revenue", getValue(visa, "totalRevenue")],
        ["Instapay Membership Revenue", getValue(instapay, "totalRevenue")],
      ],
      "pi pi-id-card",
    );
  }

  async getSharedMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];

    const [cash, instapay, visa, vodafone] = await Promise.all([
      this.dashboredService.getSharedCachRevenue(filterQueryDto),
      this.dashboredService.getSharedInstaRevenue(filterQueryDto),
      this.dashboredService.getSharedVisaRevenue(filterQueryDto),
      this.dashboredService.getSharedVodafoneRevenue(filterQueryDto),
    ]);

    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    return this.createMetrics(
      [
        ["Cash Shared Revenue", getValue(cash, "totalRevenue")],
        ["Vodafone Shared Revenue", getValue(vodafone, "totalRevenue")],
        ["Visa Shared Revenue", getValue(visa, "totalRevenue")],
        ["Instapay Shared Revenue", getValue(instapay, "totalRevenue")],
      ],
      "pi pi-id-card",
    );
  }

  async getOrderMetrics(filterQueryDto: FiltersDashboredDto, hasAccess: boolean) {
    if (!hasAccess) return [];

    const [cash, instapay, visa, vodafone] = await Promise.all([
      this.dashboredService.getOrderCachRevenue(filterQueryDto),
      this.dashboredService.getOrderInstaRevenue(filterQueryDto),
      this.dashboredService.getOrderVisaRevenue(filterQueryDto),
      this.dashboredService.getOrderVodafoneRevenue(filterQueryDto),
    ]);

    const getValue = (obj: any, prop: string) => obj?.[prop] ?? 0;

    return this.createMetrics(
      [
        ["Cash Order Revenue", getValue(cash, "totalRevenue")],
        ["Vodafone Order Revenue", getValue(vodafone, "totalRevenue")],
        ["Visa Order Revenue", getValue(visa, "totalRevenue")],
        ["Instapay Order Revenue", getValue(instapay, "totalRevenue")],
      ],
      "pi pi-id-card",
    );
  }
}
