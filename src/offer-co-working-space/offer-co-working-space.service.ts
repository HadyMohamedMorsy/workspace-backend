import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base-crud";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateCoWorkingSpaceDto } from "./dto/create-offer-co-working-space.dto";
import { UpdateCoWorkingSpaceDto } from "./dto/update-offer-co-working-space.dto";
import { CoWorkingSpace } from "./offer-co-working-space.entity";

type RelationConfig = {
  relationPath: string;
  alias: string;
  selectFields: string[];
};

@Injectable()
export class OfferCoWorkingSpaceService
  extends BaseService<CoWorkingSpace, CreateCoWorkingSpaceDto, UpdateCoWorkingSpaceDto>
  implements ICrudService<CoWorkingSpace, CreateCoWorkingSpaceDto, UpdateCoWorkingSpaceDto>
{
  constructor(
    @InjectRepository(CoWorkingSpace)
    repository: Repository<CoWorkingSpace>,
    apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  private async findRelatedEntities(filterData: any, relationConfig: RelationConfig): Promise<any> {
    const queryBuilder = this.repository.createQueryBuilder("coWorkingSpace");

    queryBuilder
      .leftJoin(`coWorkingSpace.assignessMemebership`, "assignedMembership")
      .leftJoin(`assignedMembership.${relationConfig.relationPath}`, relationConfig.alias)
      .where("coWorkingSpace.id = :id", { id: filterData.id })
      .select([
        "coWorkingSpace",
        "assignedMembership",
        ...relationConfig.selectFields.map(f => `${relationConfig.alias}.${f}`),
      ]);

    const [data, totalRecords] = await queryBuilder.getManyAndCount();
    return this.response(data, totalRecords);
  }

  async findRelatedIndividual(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "individual",
      alias: "individual",
      selectFields: ["id", "name"],
    });
  }

  async findRelatedCompany(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "company",
      alias: "company",
      selectFields: ["id", "name"],
    });
  }

  async findRelatedStudentActivity(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "studentActivity",
      alias: "activity",
      selectFields: ["id", "name"],
    });
  }

  override queryRelationIndex(
    queryBuilder?: SelectQueryBuilder<CoWorkingSpace>,
    filteredRecord?: any,
  ) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder.leftJoin("e.assignessMemebership", "em").addSelect(["em.id"]);
  }
}
