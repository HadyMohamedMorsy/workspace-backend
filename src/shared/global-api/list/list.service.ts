import { Injectable } from "@nestjs/common";
import { CategoryService } from "src/categories/category.service";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { LookupService } from "src/lookups/lookup.service";
import { OfferCoWorkingSpaceService } from "src/offer-co-working-space/offer-co-working-space.service";
import { OfferPackagesService } from "src/offer-packages/offerpackages.service";
import { RoomsService } from "src/rooms/rooms.service";
import { Module, TypeMember } from "src/shared/enum/global-enum";
import { UserService } from "src/users/user.service";
import { LIST_CITY_AR, LIST_CITY_EN } from "./lists/city/city";
import { LISTS_EXPENSES_AR, LISTS_EXPENSES_EN } from "./lists/expenses/expenses";
import { INVOICE_FILTER_AR, INVOICE_FILTER_EN } from "./lists/invoices/invoice";
import { MODULE_AR, MODULE_EN } from "./lists/module/module";
import { PACKAGES_AR, PACKAGES_EN } from "./lists/packages/packages";
import { PAYMENT_METHODS_EN } from "./lists/payment-methods/payment-methods";
import { LISTS_REVENUE_AR, LISTS_REVENUE_EN } from "./lists/revenue/revenue";
import { LISTS_ROLES_AR, LISTS_ROLES_EN } from "./lists/roles/roles";
import { Sort_CUSTOMERS_EN } from "./lists/sort-customers/sort-customers";
import { LISTS_STORE_AR, LISTS_STORE_EN } from "./lists/store/store";
import { LISTS_TYPE_COMPANY_AR, LISTS_TYPE_COMPANY_EN } from "./lists/type-company/type-company";
import { LIST_TYPE_DISCOUNT_AR, LIST_TYPE_DISCOUNT_EN } from "./lists/type-discount/type-discount";
import { LIST_TYPE_ORDER_AR, LIST_TYPE_ORDER_EN } from "./lists/type-order/type-order";
import { LIST_TYPE_PRODUCT_AR, LIST_TYPE_PRODUCT_EN } from "./lists/type-product/type-product";
import { LIST_TYPE_SALLARY_AR, LIST_TYPE_SALLARY_EN } from "./lists/type-sallary/type-sallary";
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
    private readonly lookupService: LookupService,
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
    invoice_filter: {
      en: INVOICE_FILTER_EN,
      ar: INVOICE_FILTER_AR,
    },
    store: {
      en: LISTS_STORE_EN,
      ar: LISTS_STORE_AR,
    },
    packages: {
      en: PACKAGES_EN,
      ar: PACKAGES_AR,
    },
    module: {
      en: MODULE_EN,
      ar: MODULE_AR,
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
    const strategyMap = {
      user: () => this.usersService.getList({ status: "active" }),
      room: () => this.roomService.getList(),
      categories: () => this.categoryService.getList(),
      "global-offer-shared": () => this.generalOfferService.findShared(),
      "global-offer-deskarea": () => this.generalOfferService.findDeskArea(),
      "global-offer-membership": () => this.generalOfferService.findMembership(),
      "global-offer-deals": () => this.generalOfferService.findDeals(),
      "lookups-parents-expenses": () => this.lookupService.getParents(Module.Expenses),
      "lookups-parents-revenue": () => this.lookupService.getParents(Module.Revenue),
      "lookups-parents-nationality": () => this.lookupService.getParents(Module.Nationality),
      "lookups-parents-college": () => this.lookupService.getParents(Module.College),
      "lookups-parents-city": () => this.lookupService.getParents(Module.City),
      "lookups-parents-unviresty": () => this.lookupService.getParents(Module.Unviresty),
      "lookups-parents-company": () => this.lookupService.getParents(Module.Company),
      "global-offer-packages": () => this.generalOfferService.findPackages(),
      "global-offer-rooms": () => this.generalOfferService.findRooms(),
      "membership-offer-shared": () =>
        this.offerCoWorkingSpaceService.getList({ type: TypeMember.Shared }),
      "membership-offer-deskarea": () =>
        this.offerCoWorkingSpaceService.getList({ type: TypeMember.DeskaArea }),
      "offer-package-offer": () => this.offerPackagesService.getList(undefined, ["room"]),
    };

    const strategy = strategyMap[module];
    if (!strategy) {
      throw new Error(`No strategy found for module: ${module}`);
    }

    return await strategy();
  }

  async filterRoomsCalender() {
    const rooms = await this.roomService.getList();
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

  async getLookupsChildList(parentId: number) {
    return await this.lookupService.getChildrenByParentId(parentId);
  }
}
