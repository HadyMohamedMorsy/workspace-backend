import { Injectable } from "@nestjs/common";
import { CategoryService } from "src/categories/category.service";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { OfferCoWorkingSpaceService } from "src/offer-co-working-space/offer-co-working-space.service";
import { OfferPackagesService } from "src/offer-packages/offerpackages.service";
import { RoomsService } from "src/rooms/rooms.service";
import { UserService } from "src/users/user.service";
import { LIST_CITY_AR, LIST_CITY_EN } from "./lists/city/city";
import { LISTS_EXPENSES_AR, LISTS_EXPENSES_EN } from "./lists/expenses/expenses";
import { PAYMENT_METHODS_EN } from "./lists/payment-methods/payment-methods";
import { LISTS_REVENUE_AR, LISTS_REVENUE_EN } from "./lists/revenue/revenue";
import { LISTS_ROLES_AR, LISTS_ROLES_EN } from "./lists/roles/roles";
import { Sort_CUSTOMERS_EN } from "./lists/sort-customers/sort-customers";
import { LISTS_TYPE_COMPANY_AR, LISTS_TYPE_COMPANY_EN } from "./lists/type-company/type-company";
import { LIST_TYPE_DISCOUNT_AR, LIST_TYPE_DISCOUNT_EN } from "./lists/type-discount/type-discount";
import { LIST_TYPE_ORDER_AR, LIST_TYPE_ORDER_EN } from "./lists/type-order/type-order";
import { LIST_TYPE_PRODUCT_AR, LIST_TYPE_PRODUCT_EN } from "./lists/type-product/type-product";
import { LIST_TYPE_SALLARY_AR, LIST_TYPE_SALLARY_EN } from "./lists/type-sallary/type-sallary";
import { LIST_TYPE_USER_AR, LIST_TYPE_USER_EN } from "./lists/type-user/type-user";
import { LIST_TYOE_WORK_AR, LIST_TYOE_WORK_EN } from "./lists/type-work/type-work";

@Injectable()
export class ListService {
  constructor(
    private readonly usersService: UserService,
    private readonly roomService: RoomsService,
    private readonly generalOfferService: GeneralOfferService,
    private readonly categoryService: CategoryService,
    private readonly offerPackagesService: OfferPackagesService,
    private readonly offerCoWorkingSpaceService: OfferCoWorkingSpaceService,
  ) {}
  #lists = {
    roles: {
      en: LISTS_ROLES_EN,
      ar: LISTS_ROLES_AR,
    },
    type_company: {
      en: LISTS_TYPE_COMPANY_EN,
      ar: LISTS_TYPE_COMPANY_AR,
    },
    type_work: {
      en: LIST_TYOE_WORK_EN,
      ar: LIST_TYOE_WORK_AR,
    },
    city: {
      en: LIST_CITY_EN,
      ar: LIST_CITY_AR,
    },
    type_order: {
      en: LIST_TYPE_ORDER_EN,
      ar: LIST_TYPE_ORDER_AR,
    },
    type_order_user: {
      en: LIST_TYPE_USER_EN,
      ar: LIST_TYPE_USER_AR,
    },
    type_sallary: {
      en: LIST_TYPE_SALLARY_EN,
      ar: LIST_TYPE_SALLARY_AR,
    },
    type_discount: {
      en: LIST_TYPE_DISCOUNT_EN,
      ar: LIST_TYPE_DISCOUNT_AR,
    },
    type_product: {
      en: LIST_TYPE_PRODUCT_EN,
      ar: LIST_TYPE_PRODUCT_AR,
    },
    expenses: {
      en: LISTS_EXPENSES_EN,
      ar: LISTS_EXPENSES_AR,
    },
    revenue: {
      en: LISTS_REVENUE_EN,
      ar: LISTS_REVENUE_AR,
    },
    payment_method: {
      en: PAYMENT_METHODS_EN,
      ar: PAYMENT_METHODS_EN,
    },
    sort_customers: {
      en: Sort_CUSTOMERS_EN,
      ar: Sort_CUSTOMERS_EN,
    },
  };

  async getLists(keys: string[], lang: string): Promise<Record<string, any>> {
    return keys.reduce((result, key) => {
      if (this.#lists[key]?.[lang]) {
        result[key] = this.#lists[key][lang];
      }
      return result;
    }, {});
  }

  async getEntityList(module: string) {
    if (module === "user") return await this.usersService.findList();
    if (module === "room") return await this.roomService.findList();
    if (module === "categories") return await this.categoryService.findList();
    if (module === "global-offer-shared") return await this.generalOfferService.findShared();
    if (module === "global-offer-deskarea") return await this.generalOfferService.findDeskArea();
    if (module === "global-offer-membership")
      return await this.generalOfferService.findMembership();
    if (module === "global-offer-deals") return await this.generalOfferService.findDeals();
    if (module === "global-offer-packages") return await this.generalOfferService.findPackages();
    if (module === "global-offer-rooms") return await this.generalOfferService.findRooms();
    if (module === "membership-offer-shared")
      return await this.offerCoWorkingSpaceService.findListShared();
    if (module === "membership-offer-deskarea")
      return await this.offerCoWorkingSpaceService.findListDeskArea();
    if (module === "offer-package-offer") return await this.offerPackagesService.findList();
  }

  async filterRoomsCalender() {
    const rooms = await this.roomService.findList();
    return rooms.data.map((room, index) => ({
      key: index.toString(),
      label: room.name.charAt(0).toUpperCase() + room.name.slice(1),
      value: room.id,
    }));
  }

  async getPermissionTree(permissions: { resource: string; actions: string[] }[]) {
    return permissions.map((permission, resourceIndex) => ({
      key: resourceIndex.toString(),
      label: permission.resource.charAt(0).toUpperCase() + permission.resource.slice(1),
      data: `${permission.resource}`,
      children: permission.actions.map((action, actionIndex) => ({
        key: `${resourceIndex}-${actionIndex}`,
        label: action.charAt(0).toUpperCase() + action.slice(1).toLowerCase(),
        data: `${permission.resource}:${action}`,
      })),
    }));
  }
}
