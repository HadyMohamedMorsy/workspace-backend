import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateOfferPackagesDto } from "./dto/create-offer-packages.dto";
import { UpdateOfferPackagesDto } from "./dto/update-offer-packages.dto";
import { OfferPackages } from "./offer-package.entity";

type RelationConfig = {
  relationPath: string;
  alias: string;
  selectFields: string[];
};

@Injectable()
export class OfferPackagesService
  extends BaseService<OfferPackages, CreateOfferPackagesDto, UpdateOfferPackagesDto>
  implements ICrudService<OfferPackages, CreateOfferPackagesDto, UpdateOfferPackagesDto>
{
  constructor(
    @InjectRepository(OfferPackages)
    repository: Repository<OfferPackages>,
    apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  private async findRelatedEntities(filterData: any, relationConfig: RelationConfig): Promise<any> {
    const queryBuilder = this.repository.createQueryBuilder("offerPackage");

    queryBuilder
      .leftJoin(`offerPackage.assignesPackages`, "assignedPackage")
      .leftJoin(`assignedPackage.${relationConfig.relationPath}`, relationConfig.alias)
      .where("offerPackage.id = :id", { id: filterData.id })
      .select([
        "offerPackage",
        "assignedPackage",
        ...relationConfig.selectFields.map(f => `${relationConfig.alias}.${f}`),
      ]);

    const [data, totalRecords] = await queryBuilder.getManyAndCount();
    return this.response(data, totalRecords);
  }

  async findRelatedIndividuals(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "individual",
      alias: "individual",
      selectFields: ["id"],
    });
  }

  async findRelatedCompanies(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "company",
      alias: "company",
      selectFields: ["id"],
    });
  }

  async findRelatedStudentActivities(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "studentActivity",
      alias: "activity",
      selectFields: ["id"],
    });
  }

  async findRelatedRooms(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "room",
      alias: "room",
      selectFields: ["id"],
    });
  }

  async findList() {
    const packages = await this.repository.find({
      relations: ["room"],
    });
    return {
      data: packages,
    };
  }

  override queryRelationIndex(
    queryBuilder?: SelectQueryBuilder<OfferPackages>,
    filteredRecord?: any,
  ) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder.leftJoin("e.room", "er").addSelect(["er.id", "er.name"]);
  }
}
