// src/shared/base-crud.service.ts
import { NotFoundException } from "@nestjs/common";
import { DeepPartial, FindOptionsSelect, In, Repository } from "typeorm";
import * as XLSX from 'xlsx';
import { APIFeaturesService } from "../filters/filter.service";
import { ICrudService } from "../interface/crud-service.interface";
import { BaseQueryUtils } from "./base-query.utils";

export type RelationConfig = {
  relationPath: string;
  alias: string;
  selectFields: string[];
  filterField: string;
};

export abstract class BaseService<T, CreateDto, UpdateDto>
  extends BaseQueryUtils<T>
  implements ICrudService<T, CreateDto, UpdateDto>
{
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly apiService: APIFeaturesService,
  ) {
    super();
  }

  public async findAll(filterData: any) {
    const queryBuilder = this.apiService
      .setRepository(this.repository.target)
      .buildQuery(filterData);

    this.queryRelationIndex(queryBuilder, filterData);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return this.response(filteredRecord, totalRecords);
  }

  public async findOne(
    id: number,
    selectOptions?: Record<string, boolean>,
    relations?: Record<string, any>,
    where?: Record<string, any>,
    whereDeep?: Record<string, any>,
  ): Promise<T> {
    const queryBuilder = this.repository.createQueryBuilder("e");
    queryBuilder.where("e.id = :id", { id });

    if (where) {
      queryBuilder.andWhere(where);
    }

    this.getSelectQuery(queryBuilder, selectOptions);
    this.getRelationQuery(queryBuilder, relations, whereDeep);
    const record = await queryBuilder.getOne();
    if (!record) throw new NotFoundException(`this entity is not found`);
    return record;
  }

  public async create(
    createDto: CreateDto,
    selectOptions?: Record<string, boolean>,
    relations?: Record<string, any>,
  ): Promise<T> {
    const newCreate = this.repository.create(createDto as any);
    const record = (await this.repository.save(newCreate)) as T & { id: number };
    return this.findOne(record.id, selectOptions, relations);
  }

  public async update(
    updateDto: UpdateDto & { id: number },
    selectOptions?: Record<string, boolean>,
    relations?: Record<string, any>,
  ): Promise<T> {
    const filteredUpdateDto = Object.fromEntries(
      Object.entries(updateDto).filter(([, value]) => value !== null),
    );
    await this.repository.update(updateDto.id, filteredUpdateDto as any);
    return this.findOne(updateDto.id, selectOptions, relations);
  }

  public async delete(id: number) {
    await this.repository.delete(id);
    return { deleted: true, id };
  }

  async getList(
    filterData: any = {},
    relations: string[] = [],
    selectOptions?: FindOptionsSelect<T>,
  ) {
    const records = await this.repository.find({
      where: filterData,
      select: selectOptions,
      relations: relations,
    });
    return {
      data: records,
    };
  }

  public async changeStatus(
    id: number,
    status: string | boolean,
    key: string,
    selectOptions?: Record<string, boolean>,
    updateDto?: any,
  ) {
    await this.repository.update(id, { [key]: status, ...updateDto } as any);
    return this.findOne(id, selectOptions);
  }

  async findByIds(ids: number[]): Promise<T[]> {
    return this.repository.findBy({ id: In(ids) } as any);
  }

  public async findRelatedEntities(filterData: any, relationConfig: RelationConfig): Promise<any> {
    const queryBuilder = this.apiService
      .setRepository(this.repository.target)
      .buildQuery(filterData);

    queryBuilder
      .leftJoin(`e.${relationConfig.relationPath}`, relationConfig.alias)
      .addSelect(relationConfig.selectFields.map(field => `${relationConfig.alias}.${field}`))
      .andWhere(`${relationConfig.alias}.id = :${relationConfig.filterField}`, {
        [relationConfig.filterField]: filterData[relationConfig.filterField],
      });

    this.queryRelationIndex(queryBuilder);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return this.response(filteredRecord, totalRecords);
  }

  async importFromExcel<D extends DeepPartial<T>>(
    filePath: string,
    options: {
      requiredFields: (keyof D)[];
      fieldMappings: Record<string, keyof D>;
      findKey?: keyof D;
      start?: number;  // Starting row index (0-based)
      limit?: number;  // Number of rows to process
    }
  ): Promise<{ success: number; errors: string[] }> {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const allRows: any[] = XLSX.utils.sheet_to_json(worksheet);

    // Calculate the slice of rows to process
    const start = options.start || 0;
    const limit = options.limit || 20;
    const rows = allRows.slice(start, start + limit);

    const errors: string[] = [];
    let successCount = 0;

    for (const [index, row] of rows.entries()) {
      const data = {} as D;

      const missingFields = options.requiredFields.filter(field => !data[field]);
      if (missingFields.length > 0) {
        errors.push(`Row ${start + index + 2}: Missing required fields (${missingFields.join(', ')})`);
        continue;
      }
      
      Object.entries(options.fieldMappings).forEach(([excelField, dtoField]) => {
        const value = row[excelField];
        if (value !== undefined) {
          data[dtoField] = value?.toString()?.trim() || null;
        }
      });

      try {
        let existing: T | null = null;
        
        if (options.findKey && data[options.findKey]) {
          existing = await this.repository.findOne({ 
            where: { [options.findKey]: data[options.findKey] } as any 
          });
        }

        await this.handleEntityOperation(existing, data);
        successCount++;

      } catch (error) {
        errors.push(`Row ${start + index + 2}: ${error.message || "Database operation failed"}`);
      }
    }

    return { success: successCount, errors };
  }

  private async handleEntityOperation(existing: T | null, data: any): Promise<void> {
    if (existing) {
      await this.repository.update((existing as any).id, data);
    } else {
      await this.repository.save(data);
    }
  }
}
