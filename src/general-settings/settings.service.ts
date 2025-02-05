import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateGeneralSettingsDto } from "./dto/create-settings.dto";
import { GeneralSettings } from "./general-settings.entity";

@Injectable()
export class GeneralSettingsService {
  constructor(
    @InjectRepository(GeneralSettings)
    private generalSettingsRepository: Repository<GeneralSettings>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  // Create a new record
  async create(createGeneralSettingsDto: CreateGeneralSettingsDto): Promise<GeneralSettings> {
    const generalSettings = this.generalSettingsRepository.create(createGeneralSettingsDto);
    return await this.generalSettingsRepository.save(generalSettings);
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(GeneralSettings)
      .buildQuery(filterData);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }
}
