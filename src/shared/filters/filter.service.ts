import { Injectable } from "@nestjs/common";
import { DataSource, EntityTarget, Repository, SelectQueryBuilder } from "typeorm";

@Injectable()
export class APIFeaturesService {
  #repository: Repository<any>;
  cacheFilters = new Map<string, Set<string>>();

  constructor(private readonly dataSource: DataSource) {}

  setRepository(entity: EntityTarget<any>) {
    this.#repository = this.dataSource.getRepository(entity);
    return this;
  }

  // Instead of executing the query immediately, we now return the query builder.
  buildQuery(filterData: any): SelectQueryBuilder<any> {
    const queryBuilder = this.#repository.createQueryBuilder("e");

    this.#handleColumnSelection(filterData, queryBuilder);

    this.#applyCustomFiltersToQuery(filterData, queryBuilder);

    this.#applySearchFilter(filterData, queryBuilder);

    this.#applySorting(filterData, queryBuilder);

    this.#applyPagination(filterData, queryBuilder);

    return queryBuilder;
  }

  #handleColumnSelection(filterData: any, queryBuilder: SelectQueryBuilder<any>) {
    const filterValidColumns = fields => {
      if (!fields || fields.length === 0) return [];

      return fields
        .filter(
          field =>
            typeof field.name === "string" &&
            !field.name.includes(".") &&
            field.name !== "id" &&
            field.name !== "created_at",
        )
        .map(field => `e.${field.name}`);
    };

    if (filterData.columns && Array.isArray(filterData.columns)) {
      const validColumns = filterValidColumns(filterData.columns);
      if (validColumns.length > 0) {
        queryBuilder.select([...validColumns, "e.id", "e.created_at"]);
      }
    }

    if (filterData.provideFields && Array.isArray(filterData.provideFields)) {
      if (filterData.provideFields.length > 0) {
        queryBuilder.addSelect(filterData.provideFields.map(col => `e.${col}`));
      }
    }
  }

  #applyCustomFiltersToQuery(filterData: any, queryBuilder: SelectQueryBuilder<any>) {
    if (filterData.customFilters) {
      const customFilters = this.#applyCustomFilters(filterData.customFilters);

      if (customFilters) {
        Object.entries(customFilters)
          .filter(
            ([key, value]) =>
              !["start_date", "end_date"].includes(key) && value != null && value !== "",
          )
          .forEach(([key, value]) => {
            queryBuilder.andWhere(`e.${key} = :${key}`, { [key]: value });
          });
      }
    }
  }

  #applySearchFilter(filterData: any, queryBuilder: SelectQueryBuilder<any>) {
    if (filterData.search && filterData.search.value) {
      const searchableColumns = filterData.columns.filter(
        (col: any) => col.searchable && !col.name.includes("."),
      );
      if (searchableColumns.length) {
        searchableColumns.forEach(column => {
          queryBuilder.orWhere(`e.${column.name} LIKE :search`, {
            search: `%${filterData.search.value}%`,
          });
        });
      }
    }
  }

  #applySorting(filterData: any, queryBuilder: SelectQueryBuilder<any>) {
    if (filterData.order && filterData.order.length > 0 && filterData.columns.length > 0) {
      filterData.order.forEach(({ column, dir }) => {
        const columnInfo = filterData.columns[column];
        if (columnInfo && columnInfo.orderable) {
          queryBuilder.addOrderBy(`e.${columnInfo.name}`, dir.toUpperCase());
        }
      });
    } else {
      queryBuilder.addOrderBy("e.created_at", "DESC");
    }
  }

  #applyPagination(filterData: any, queryBuilder: SelectQueryBuilder<any>) {
    const { start, length } = filterData;
    queryBuilder.skip(start ?? 0).take(length ?? 10);
  }

  #applyCustomFilters(customFilters: Record<string, any>): Record<string, any> {
    const filterConditions: Record<string, any> = {};

    for (const [key, value] of Object.entries(customFilters)) {
      filterConditions[key] = value;
    }

    return filterConditions;
  }
}
