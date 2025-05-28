// src/shared/base-crud.service.ts
import { NotFoundException } from "@nestjs/common";
import { FindOptionsSelect, In, Repository } from "typeorm";
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
  ): Promise<T> {
    const queryBuilder = this.repository.createQueryBuilder("e");
    queryBuilder.where("e.id = :id", { id });

    this.getSelectQuery(queryBuilder, selectOptions);
    this.getRelationQuery(queryBuilder, relations);
    const record = await queryBuilder.getOne();
    if (!record) throw new NotFoundException(`this user is not found`);
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
    await this.repository.update(updateDto.id, updateDto as any);
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
}
