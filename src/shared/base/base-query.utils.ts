import { SelectQueryBuilder } from "typeorm";

export abstract class BaseQueryUtils<T> {
  protected getRelationQuery(
    queryBuilder: SelectQueryBuilder<T>,
    relations: Record<string, any>,
    whereDeep?: Record<string, any>,
  ) {
    if (relations && Object.keys(relations).length > 0) {
      const processRelation = (relationPath: string, fields: Record<string, any>) => {
        const pathParts = relationPath.split(".");
        const alias = pathParts[pathParts.length - 1];

        const joinPath =
          pathParts.length > 1 ? `${pathParts.slice(0, -1).join(".")}.${alias}` : `e.${alias}`;

        queryBuilder.leftJoin(joinPath, alias);

        Object.entries(fields).forEach(([key, value]) => {
          if (typeof value === "object" && !Array.isArray(value)) {
            processRelation(`${relationPath}.${key}`, value);
          } else {
            queryBuilder.addSelect(`${alias}.${key}`);
          }
        });
        if (whereDeep && pathParts.length === 1 && Object.keys(whereDeep).length > 0) {
          Object.entries(whereDeep).forEach(([field, value]) => {
            if (value !== undefined && value !== null) {
              queryBuilder.andWhere(`${alias}.${field} = :${alias}_${field}`, {
                [`${alias}_${field}`]: value,
              });
            }
          });
        }
      };

      Object.entries(relations).forEach(([relation, fields]) => {
        if (typeof fields === "object") {
          processRelation(relation, fields);
        }
      });
    }
  }

  protected getSelectQuery(
    queryBuilder: SelectQueryBuilder<T>,
    selectOptions: Record<string, boolean>,
  ) {
    if (selectOptions) {
      const selectFields = Object.entries(selectOptions).map(([key]) => `e.${key}`);
      queryBuilder.select(selectFields);
    }
  }

  protected response(data: T[], totalRecords: number = 0): any {
    return {
      data,
      recordsFiltered: data.length,
      totalRecords: +totalRecords,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected queryRelationIndex(queryBuilder?: SelectQueryBuilder<T>, filteredRecord?: any) {
    queryBuilder.leftJoin("e.createdBy", "ec").addSelect(["ec.id", "ec.firstName", "ec.lastName"]);
  }
}
