import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { CachingInterceptor } from "src/shared/interceptor/caching-response.interceptor";
import { DahboredService } from "./dahsbored.service";
import { FiltersDashboredDto } from "./dto/filter-dashbored.dto";

@Controller("dashboard")
export class DashboredController {
  constructor(private readonly dashboredService: DahboredService) {}

  @Post("analytics")
  @UseInterceptors(CachingInterceptor)
  async getAnalytics(@Body() filterQueryDto: FiltersDashboredDto) {
    const totalSallary = await this.dashboredService.getAllExapsesSallary(filterQueryDto);
    const totalExpanses = await this.dashboredService.getAllExapsesPlace(filterQueryDto);
    const totalCountPurshase = await this.dashboredService.getAllCountPurshases(filterQueryDto);
    const totalCountReturns = await this.dashboredService.getAllCountReturns(filterQueryDto);
    const totalPurshase = await this.dashboredService.getTotalPurshases(filterQueryDto);
    const totalReturns = await this.dashboredService.getTotalReturns(filterQueryDto);
    const totalCountOrderPaid = await this.dashboredService.getCountPaidOrders(filterQueryDto);
    const totalCountOrderCost = await this.dashboredService.getCountCostOrders(filterQueryDto);
    const totalCountOrderFree = await this.dashboredService.getCountFreeOrders(filterQueryDto);
    const totalCountOrderHold = await this.dashboredService.getCountHoldOrders(filterQueryDto);
    const totalOrderPaid = await this.dashboredService.getTotalPaidOrders(filterQueryDto);
    const totalOrderCost = await this.dashboredService.getTotalCostOrders(filterQueryDto);
    const totalOrderHold = await this.dashboredService.getTotalHoldOrders(filterQueryDto);
    const totalOrderPrice = await this.dashboredService.getTotalOrderPriceOrders(filterQueryDto);
    return [
      {
        title: "Total Sallary Cost",
        value: totalSallary.totalCost ?? 0,
        icon: "pi pi-home",
      },
      {
        title: "Total Expenses Cost",
        value: totalExpanses.totalCost ?? 0,
        icon: "pi pi-home",
      },
      {
        title: "Total Count Purshase",
        value: totalCountPurshase.count ?? 0,
        icon: "pi pi-home",
      },
      {
        title: "Total Count Returns",
        value: totalCountReturns.count ?? 0,
        icon: "pi pi-home",
      },
      {
        title: "Total Purshase",
        value: totalPurshase.total ?? 0,
        icon: "pi pi-home",
      },
      {
        title: "Total Returns",
        value: totalReturns.total ?? 0,
        icon: "pi pi-home",
      },
      {
        title: "Count Orders Paid",
        value: totalCountOrderPaid.count ?? 0,
        icon: "pi pi-home",
      },
      {
        title: "Count Orders Cost",
        value: totalCountOrderCost.count ?? 0,
        icon: "pi pi-home",
      },
      {
        title: "Count Orders Free",
        value: totalCountOrderFree.count ?? 0,
        icon: "pi pi-home",
      },
      {
        title: "Count Orders Hold",
        value: totalCountOrderHold.count ?? 0,
        icon: "pi pi-home",
      },
      {
        title: "Total Orders Paid",
        value: totalOrderPaid.total ?? 0,
        icon: "pi pi-home",
      },
      {
        title: "Total Orders Cost",
        value: totalOrderCost.total ?? 0,
        icon: "pi pi-home",
      },
      {
        title: "Total Orders Hold",
        value: totalOrderHold.total ?? 0,
        icon: "pi pi-home",
      },
      {
        title: "Amount Orders kitchen",
        value: totalOrderPrice.total ?? 0,
        icon: "pi pi-home",
      },
      {
        title: "Total Orders kitchen",
        value: totalOrderPaid.total + totalOrderCost.total || 0,
        icon: "pi pi-home",
      },
    ];
  }
}
