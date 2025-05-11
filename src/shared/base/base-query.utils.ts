import { SelectQueryBuilder } from "typeorm";

export abstract class BaseQueryUtils<T> {
  protected getRelationQuery(queryBuilder: SelectQueryBuilder<T>, relations: Record<string, any>) {
    if (relations && Object.keys(relations).length > 0) {
      const processRelation = (relationPath: string, fields: Record<string, any>) => {
        const selectFields = Object.entries(fields).map(([key]) => `${relationPath}.${key}`);
        queryBuilder.leftJoin(`e.${relationPath}`, relationPath).addSelect(selectFields);

        Object.entries(fields).forEach(([key, value]) => {
          if (typeof value === "object" && !Array.isArray(value))
            processRelation(`${relationPath}.${key}`, value);
        });
      };

      Object.entries(relations).forEach(([relation, fields]) => {
        if (typeof fields === "object") processRelation(relation, fields);
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

  protected response(data: T[], totalRecords: number) {
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
