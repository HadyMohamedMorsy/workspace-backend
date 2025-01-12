import { Injectable } from "@nestjs/common";
import { LIST_CITY_AR, LIST_CITY_EN } from "./lists/city/city";
import { LISTS_ROLES_AR, LISTS_ROLES_EN } from "./lists/roles/roles";
import { LISTS_TYPE_COMPANY_AR, LISTS_TYPE_COMPANY_EN } from "./lists/type-company/type-company";
import { LIST_TYOE_WORK_AR, LIST_TYOE_WORK_EN } from "./lists/type-wrok/type-work";

@Injectable()
export class ListService {
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
  };

  async getLists(keys: string[], lang: string): Promise<Record<string, any>> {
    return keys.reduce((result, key) => {
      if (this.#lists[key]?.[lang]) {
        result[key] = this.#lists[key][lang];
      }
      return result;
    }, {});
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
