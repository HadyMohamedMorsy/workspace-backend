import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { Module } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateLookupDto } from "./dto/create-lookup.dto";
import { UpdateLookupDto } from "./dto/update-lookup.dto";
import { Lookup } from "./lookup.entity";

@Injectable()
export class LookupService
  extends BaseService<Lookup, CreateLookupDto, UpdateLookupDto>
  implements ICrudService<Lookup, CreateLookupDto, UpdateLookupDto>
{
  constructor(
    @InjectRepository(Lookup)
    private lookupRepository: Repository<Lookup>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(lookupRepository, apiFeaturesService);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);

    if (filteredRecord?.parentId) {
      // When parentId is provided, get children of that parent only
      queryBuilder
        .leftJoin("e.parent", "parent")
        .addSelect(["parent.id", "parent.name"])
        .andWhere("parent.id = :parentId", { parentId: filteredRecord.parentId });
    } else {
      // When no parentId, get only parents (items with no parent) - no children
      queryBuilder
        .leftJoin("e.parent", "parent")
        .addSelect(["parent.id", "parent.name"])
        .andWhere("e.parent IS NULL");
    }
  }

  findByName(name: string) {
    return this.lookupRepository.findOne({
      where: { name },
    });
  }

  async getParents(module?: Module) {
    const whereCondition: any = { parent: null };

    if (module) {
      whereCondition.module = module;
    }

    const parents = await this.lookupRepository.find({
      where: whereCondition,
      select: ["id", "name", "module"],
      order: { name: "ASC" },
    });

    return {
      data: {
        parents: parents.map(parent => ({
          id: parent.id,
          label: parent.name,
          value: parent.id,
          module: parent.module,
        })),
      },
    };
  }

  // Get children of a specific parent
  async getChildrenByParentId(parentId: number) {
    const children = await this.lookupRepository.find({
      where: { parent: { id: parentId } },
      order: { name: "ASC" },
    });

    return children.map(child => ({
      id: child.id,
      label: child.name,
      value: child.id,
    }));
  }
}
