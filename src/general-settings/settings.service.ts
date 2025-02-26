import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateGeneralSettingsDto } from "./dto/create-settings.dto";
import { UpdateGeneralSettingsDto } from "./dto/update-settings-packages.dto";
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

  async findOne(id: number): Promise<GeneralSettings> {
    const setting = await this.generalSettingsRepository.findOne({
      where: { id },
    });
    if (!setting) {
      throw new NotFoundException(`${setting} with id ${id} not found`);
    }
    return setting;
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(GeneralSettings)
      .buildQuery(filterData);

    const filteredRecord = await queryBuilder.getMany();

    return filteredRecord;
  }

  async update(updateGeneralSettingsDto: UpdateGeneralSettingsDto) {
    await this.generalSettingsRepository.update(
      updateGeneralSettingsDto.id,
      updateGeneralSettingsDto,
    );
    return this.generalSettingsRepository.findOne({ where: { id: updateGeneralSettingsDto.id } });
  }
}
