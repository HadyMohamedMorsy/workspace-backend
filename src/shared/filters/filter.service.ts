import { Injectable } from "@nestjs/common";
import { Between, DataSource, EntityTarget, In, Like, Repository } from "typeorm";

@Injectable()
export class APIFeaturesService {
  #repository: Repository<any>;
  cacheFilters = new Map<string, Set<string>>();

  constructor(private readonly dataSource: DataSource) {}

  setRepository(entity: EntityTarget<any>) {
    this.#repository = this.dataSource.getRepository(entity);
    return this;
  }

  #queryBuilder(filterData: any): any {
    const queryOptions: any = {};

    // Handle columns selection
    this.#handleColumnSelection(filterData, queryOptions);

    // Apply custom filters if provided
    this.#applyCustomFiltersToQuery(filterData, queryOptions);

    // Apply search filters
    this.#applySearchFilter(filterData, queryOptions);

    // Handle sorting
    this.#applySorting(filterData, queryOptions);

    // Handle pagination
    this.#applyPagination(filterData, queryOptions);

    // Handle relations and related conditions
    this.#applyRelationsAndRelatedConditions(filterData, queryOptions);

    return queryOptions;
  }

  #handleColumnSelection(filterData: any, queryOptions: any) {
    if (filterData.columns && filterData.columns.length) {
      queryOptions.select = [...filterData.columns.map((col: any) => col.name), "id", "created_at"];
    }
    // Handle additional fields to select
    if (filterData.provideFields && filterData.provideFields.length) {
      queryOptions.select = [...queryOptions.select, ...filterData.provideFields];
    }
  }

  // Apply custom filters
  #applyCustomFiltersToQuery(filterData: any, queryOptions: any) {
    if (filterData.customFilters) {
      const customFilters = this.#applyCustomFilters(filterData.customFilters);
      const { start_date, end_date, ...filters } = customFilters;

      if (customFilters) {
        queryOptions.where = {
          ...queryOptions.where,
          ...filters,
          created_at: Between(start_date, end_date),
        };
      }
    }
  }

  #applySearchFilter(filterData: any, queryOptions: any) {
    if (filterData.search && filterData.search.value) {
      const searchableColumns = filterData.columns.filter((col: any) => col.searchable);
      if (searchableColumns.length) {
        queryOptions.where = this.#searchQuery(searchableColumns, filterData.search.value);
      }
    }
  }

  #applySorting(filterData: any, queryOptions: any) {
    queryOptions.order = this.#buildSortQuery(filterData);
  }

  #applyPagination(filterData: any, queryOptions: any) {
    const { start, length } = filterData;
    queryOptions.skip = start ?? 0;
    queryOptions.take = length ?? 10;
  }

  #applyRelationsAndRelatedConditions(filterData: any, queryOptions: any) {
    if (filterData.relations && filterData.relations.length > 0) {
      queryOptions.relations = filterData.relations;
    }

    if (filterData.findRelated) {
      queryOptions.where = {
        ...queryOptions.where,
        [filterData.findRelated.moduleName]: { id: filterData.findRelated.id },
      };
    }

    if (filterData.findRelations) {
      queryOptions.where = {
        ...queryOptions.where,
        [filterData.findRelations.moduleName]: { id: In(filterData.findRelations.ids) },
      };
    }
  }

  #searchQuery(
    searchableColumns: {
      name: string;
      searchable: boolean;
      orderable: boolean;
    }[],
    search: string,
  ) {
    if (searchableColumns.length) {
      return searchableColumns.map(column => ({
        [column.name]: Like(`%${search}%`),
      }));
    }
  }

  #buildSortQuery(filterData: any) {
    let orderQuery = {};

    if (filterData.order && filterData.order.length > 0 && filterData.columns.length > 0) {
      filterData.order.forEach(({ column, dir }) => {
        const columnInfo = filterData.columns[column];

        if (columnInfo && columnInfo.orderable) {
          orderQuery[columnInfo.name] = dir === "asc" ? "ASC" : "DESC";
        }
      });
    }

    if (Object.keys(orderQuery).length === 0) {
      orderQuery = { created_at: "DESC" };
    }

    return orderQuery;
  }

  #applyCustomFilters(customFilters: Record<string, any>): Record<string, any> {
    const filterConditions: Record<string, any> = {};

    const filterHandlers = {
      start_date: this.#handleStartDateFilter,
      end_date: this.#handleEndDateFilter,
    };

    for (const [key, value] of Object.entries(customFilters)) {
      if (filterHandlers[key]) {
        const handler = filterHandlers[key];
        handler(value, filterConditions);
      } else {
        filterConditions[key] = value;
      }
    }

    return filterConditions;
  }

  async getFilteredData(filterData: any): Promise<any[]> {
    if (!this.#repository) {
      throw new Error("Repository is not set for the entity");
    }
    const queryOptions: any = {
      ...this.#queryBuilder(filterData),
    };

    try {
      // Execute the query with relations
      return await this.#repository.find(queryOptions);
    } catch (error) {
      console.error("Error during query execution:", error);
      throw error;
    }
  }

  async getTotalDocs() {
    if (!this.#repository) {
      throw new Error("Repository is not set for the entity");
    }

    return await this.#repository.count({});
  }

  #handleStartDateFilter(value: any, filterConditions: Record<string, any>) {
    filterConditions["start_date"] = new Date(value);
  }

  #handleEndDateFilter(value: any, filterConditions: Record<string, any>) {
    filterConditions["end_date"] = new Date(value);
  }
}
