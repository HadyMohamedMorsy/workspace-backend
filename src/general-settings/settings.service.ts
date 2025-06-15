import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateGeneralSettingsDto } from "./dto/create-settings.dto";
import { UpdateGeneralSettingsDto } from "./dto/update-settings-packages.dto";
import { GeneralSettings } from "./general-settings.entity";

@Injectable()
export class GeneralSettingsService
  extends BaseService<GeneralSettings, CreateGeneralSettingsDto, UpdateGeneralSettingsDto>
  implements ICrudService<GeneralSettings, CreateGeneralSettingsDto, UpdateGeneralSettingsDto>
{
  constructor(
    @InjectRepository(GeneralSettings)
    repository: Repository<GeneralSettings>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoin("e.createdBy", "createdBy")
      .addSelect(["createdBy.id", "createdBy.firstName", "createdBy.lastName"]);
  }

  protected override response(data: GeneralSettings[]) {
    return data[0] ? data[0] : null;
  }
}
