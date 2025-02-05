import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { RoomsService } from "src/rooms/rooms.service";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { Repository } from "typeorm";
import { Deals } from "./deals.entity";
import { CreateDealsDto } from "./dto/create-deals.dto";
import { UpdateDealsDto } from "./dto/update-deals.dto";

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Deals)
    private dealsRepository: Repository<Deals>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly roomService: RoomsService,
  ) {}

  // Create a new record
  async create(
    createDealsDto: CreateDealsDto,
    customer: Individual | Company | StudentActivity,
  ): Promise<Deals> {
    const { type_user } = createDealsDto;
    const room = await this.roomService.findOne(createDealsDto.room_id);

    const deals = this.dealsRepository.create({
      ...createDealsDto,
      room,
      [type_user.toLowerCase()]: customer,
    });

    return await this.dealsRepository.save(deals);
  }

  // Get all records
  async findAll(filterData) {
    this.apiFeaturesService.setRepository(Deals);
    const queryBuilder = this.apiFeaturesService.setRepository(Deals).buildQuery(filterData);

    queryBuilder
      .leftJoin("e.room", "er")
      .leftJoin("e.company", "ec")
      .leftJoin("e.studentActivity", "es")
      .leftJoin("e.individual", "ei")
      .addSelect([
        "ei.id",
        "ei.name",
        "ei.number",
        "ei.whatsApp",
        "es.id",
        "es.name",
        "es.unviresty",
        "ec.id",
        "ec.name",
        "ec.phone",
        "er.id",
        "er.name",
        "er.price",
      ]);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<Deals> {
    return this.dealsRepository.findOne({ where: { id } });
  }

  // Update a record
  async update(updateDealsDto: UpdateDealsDto) {
    await this.dealsRepository.update(updateDealsDto.id, updateDealsDto);
    return this.dealsRepository.findOne({ where: { id: updateDealsDto.id } });
  }

  // Delete a record
  async remove(id: number) {
    await this.dealsRepository.delete(id);
  }
}
