import { Injectable } from "@nestjs/common";
import { DataSource, EntityTarget, In, Like, Repository } from "typeorm";

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

  #handleColumnSelection(filterData: any, queryOptions: any): void {
    if (filterData.columns && filterData.columns.length) {
      queryOptions.select = [...filterData.columns.map((col: any) => col.name), "id", "created_at"];
    }
    // Handle additional fields to select
    if (filterData.provideFields && filterData.provideFields.length) {
      queryOptions.select = [...queryOptions.select, ...filterData.provideFields];
    }
  }

  // Apply custom filters
  #applyCustomFiltersToQuery(filterData: any, queryOptions: any): void {
    if (filterData.customFilters) {
      queryOptions.where = {
        ...queryOptions.where,
        ...this.#applyCustomFilters(filterData.customFilters),
      };
    }
  }

  // Apply search filter if provided
  #applySearchFilter(filterData: any, queryOptions: any): void {
    if (filterData.search && filterData.search.value) {
      const searchableColumns = filterData.columns.filter((col: any) => col.searchable);
      if (searchableColumns.length) {
        queryOptions.where = this.#searchQuery(searchableColumns, filterData.search.value);
      }
    }
  }

  // Apply sorting to the query options
  #applySorting(filterData: any, queryOptions: any): void {
    queryOptions.order = this.#buildSortQuery(filterData);
  }

  // Apply pagination to the query options
  #applyPagination(filterData: any, queryOptions: any): void {
    const { start, length } = filterData;
    queryOptions.skip = start ?? 0;
    queryOptions.take = length ?? 10;
  }

  #applyRelationsAndRelatedConditions(filterData: any, queryOptions: any): void {
    // Handle relations
    if (filterData.relations && filterData.relations.length > 0) {
      queryOptions.relations = filterData.relations;
    }

    // Handle findRelated and findRelations
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

    for (const [key, value] of Object.entries(customFilters)) {
      if (key === "dateRange" && value.startDate && value.endDate) {
        filterConditions["created_at"] = {
          $gte: new Date(value.startDate),
          $lte: new Date(value.endDate),
        };
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

  async getTotalDocs(): Promise<number> {
    if (!this.#repository) {
      throw new Error("Repository is not set for the entity");
    }

    return await this.#repository.count({});
  }
}
