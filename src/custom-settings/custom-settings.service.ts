import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CustomSettings } from "./custom-settings.entity";
import { CreateCustomSettingsDto } from "./dto/create-custom-settings.dto";
import { UpdateCustomSettingsDto } from "./dto/update-custom-settings.dto";

@Injectable()
export class CustomSettingsService
  extends BaseService<CustomSettings, CreateCustomSettingsDto, UpdateCustomSettingsDto>
  implements ICrudService<CustomSettings, CreateCustomSettingsDto, UpdateCustomSettingsDto>
{
  constructor(
    @InjectRepository(CustomSettings)
    repository: Repository<CustomSettings>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoin("e.individual", "individual")
      .addSelect(["individual.id", "individual.name", "individual.number"])
      .leftJoin("e.company", "company")
      .addSelect(["company.id", "company.name", "company.phone"])
      .leftJoin("e.studentActivity", "studentActivity")
      .addSelect(["studentActivity.id", "studentActivity.name"]);
  }

  async getSettingsForUser(
    entityType: "individual" | "company" | "studentActivity",
    entityId: number,
  ) {
    const queryBuilder = this.repository.createQueryBuilder("customSettings");

    if (entityType === "individual") {
      queryBuilder.where("customSettings.individual.id = :entityId", { entityId });
    } else if (entityType === "company") {
      queryBuilder.where("customSettings.company.id = :entityId", { entityId });
    } else if (entityType === "studentActivity") {
      queryBuilder.where("customSettings.studentActivity.id = :entityId", { entityId });
    }

    return await queryBuilder.getOne();
  }
}
