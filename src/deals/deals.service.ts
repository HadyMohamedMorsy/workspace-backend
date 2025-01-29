import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CompanyService } from "src/companies/company.service";
import { IndividualService } from "src/individual/individual.service";
import { TypeUser } from "src/orders/enum/type.enum";
import { RoomsService } from "src/rooms/rooms.service";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivityService } from "src/student-activity/studentActivity.service";
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
    protected readonly companyService: CompanyService,
    protected readonly individualService: IndividualService,
    protected readonly studentActivityService: StudentActivityService,
    protected readonly roomService: RoomsService,
  ) {}

  // Create a new record
  async create(createDealsDto: CreateDealsDto): Promise<Deals> {
    const { type_user, customer_id } = createDealsDto;
    const room = await this.roomService.findOne(createDealsDto.room_id);

    let customer;

    switch (type_user) {
      case TypeUser.Individual:
        customer = await this.individualService.findOne(customer_id);
        break;
      case TypeUser.Company:
        customer = await this.companyService.findOne(customer_id);
        break;
      case TypeUser.StudentActivity:
        customer = await this.studentActivityService.findOne(customer_id);
        break;
      default:
        throw new Error("Invalid user type");
    }

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
    const filteredRecord = await this.apiFeaturesService.getFilteredData({
      ...filterData,
      relations: ["individual", "company", "studentActivity", "room"],
    });
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

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
