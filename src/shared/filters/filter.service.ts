import { Injectable } from "@nestjs/common";
import { DataSource, EntityTarget, In, Like, Repository } from "typeorm";

@Injectable()
export class APIFeaturesService {
  #repository: Repository<any>;
  cacheFilters = new Map<string, Set<string>>();

  constructor(private readonly dataSource: DataSource) {}

  setRepository(entity: EntityTarget<any>) {
    this.#repository = this.dataSource.getRepository(entity);
  }

  #queryBuilder(filterData: any): any {
    const queryOptions: any = {};
    let whereConditions: Record<string, any> = {};

    if (filterData.columns && filterData.columns.length) {
      queryOptions.select = [...filterData.columns.map(col => col.name), "id", "created_at"];
    }

    if (filterData.customFilters) {
      whereConditions = {
        ...whereConditions,
        ...this.#applyCustomFilters(filterData.customFilters),
      };
    }

    if (Object.keys(whereConditions).length > 0) {
      queryOptions.where = whereConditions;
    }

    if (filterData.search && filterData.search.value) {
      // Search filter
      const searchableColumns = filterData.columns.filter(col => col.searchable);
      if (searchableColumns.length) {
        queryOptions.where = this.searchQuery(searchableColumns, filterData.search.value);
      }
    }

    // Columns to select
    if (filterData.provideFields && filterData.provideFields.length) {
      queryOptions.select = [
        ...filterData.columns.map(col => col.name),
        "id",
        ...filterData.provideFields,
      ];
    }

    // Sorting
    queryOptions.order = this.#buildSortQuery(filterData);

    // Pagination
    const { start, length } = filterData;
    queryOptions.skip = start ?? 0;
    queryOptions.take = length ?? 10;

    return queryOptions;
  }

  async getFilteredData(
    filterData: any,
    options?: {
      relations?: string[];
      findRelated?: { moduleName: string; id: number };
      findRelations?: { moduleName: string; ids: number[] };
    },
  ): Promise<any[]> {
    if (!this.#repository) {
      throw new Error("Repository is not set for the entity");
    }
    const queryOptions: any = {
      ...this.#queryBuilder(filterData),
    };

    if (options && options.relations.length > 0) {
      queryOptions.relations = options.relations;
    }

    if (options?.findRelated) {
      queryOptions.where = {
        ...queryOptions.where,
        [options.findRelated.moduleName]: { id: options.findRelated.id },
      };
    } else if (options?.findRelations) {
      queryOptions.where = {
        ...queryOptions.where,
        [options.findRelations.moduleName]: { id: In(options.findRelations.ids) },
      };
    }

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

  searchQuery(
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
      } else if (
        key === "priceRange" &&
        value.minPrice !== undefined &&
        value.maxPrice !== undefined
      ) {
        filterConditions["price"] = {
          $gte: value.minPrice,
          $lte: value.maxPrice,
        };
      } else {
        filterConditions[key] = value;
      }
    }
    return filterConditions;
  }
}
