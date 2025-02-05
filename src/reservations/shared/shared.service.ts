import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/companies/company.entity";
import { CompanyService } from "src/companies/company.service";
import { Individual } from "src/individual/individual.entity";
import { IndividualService } from "src/individual/individual.service";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { StudentActivityService } from "src/student-activity/studentActivity.service";
import { In, Repository } from "typeorm";
import { CreateSharedDto } from "./dto/create-shared.dto";
import { UpdateSharedDto } from "./dto/update-shared.dto";
import { Shared } from "./shared.entity";

@Injectable()
export class SharedService {
  constructor(
    @InjectRepository(Shared)
    private sharedRepository: Repository<Shared>,
    protected readonly individualService: IndividualService,
    protected readonly companyService: CompanyService,
    protected readonly studentActivityService: StudentActivityService,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  async create(createSharedDto: CreateSharedDto, customer: Individual | Company | StudentActivity) {
    const { customer_id, type_user } = createSharedDto;
    const isReservation = await this.findActiveOrInactiveReservationsForCustomer(
      customer_id,
      type_user,
    );
    if (isReservation && isReservation.length) {
      throw new BadRequestException(`u can't reservation again for this user`);
    }

    const shared = this.sharedRepository.create({
      ...createSharedDto,
      [createSharedDto.type_user.toLowerCase()]: customer,
    });
    return await this.sharedRepository.save(shared);
  }

  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Shared).buildQuery(filterData);
    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();
    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findActiveOrInactiveReservationsForCustomer(customer_id: number, customer_type: string) {
    const customerRelationMap = {
      individual: "individual",
      company: "company",
      studentActivity: "studentActivity",
    };

    const customerRelationField = customerRelationMap[customer_type];
    const customerCondition = { [customerRelationField]: { id: customer_id } };

    const existingReservations = await this.sharedRepository.find({
      relations: [customerRelationField],
      where: [
        {
          status: In([ReservationStatus.ACTIVE, ReservationStatus.INACTIVE]),
          ...customerCondition,
        },
      ],
    });

    return existingReservations;
  }

  async findOne(id: number): Promise<Shared> {
    const shared = await this.sharedRepository.findOne({ where: { id } });
    if (!shared) {
      throw new NotFoundException(`${shared} with id ${id} not found`);
    }
    return shared;
  }

  async update(updateSharedDto: UpdateSharedDto) {
    await this.sharedRepository.update(updateSharedDto.id, updateSharedDto);
    return this.sharedRepository.findOne({ where: { id: updateSharedDto.id } });
  }

  async remove(sharedId: number) {
    await this.sharedRepository.delete(sharedId);
  }
}
