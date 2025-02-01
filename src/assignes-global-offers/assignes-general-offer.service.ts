import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CompanyService } from "src/companies/company.service";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { IndividualService } from "src/individual/individual.service";
import { TypeUser } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivityService } from "src/student-activity/studentActivity.service";
import { Repository } from "typeorm";
import { AssignGeneralOffer } from "./assignes-general-offer.entity";
import { CreateAssignGeneralOfferDto } from "./dto/create-assign-general-offer.dto";
import { UpdateAssignGeneralOfferDto } from "./dto/update-assign-general-offer.dto";

@Injectable()
export class AssignGeneralOfferService {
  constructor(
    @InjectRepository(AssignGeneralOffer)
    private assignGeneralOfferRepository: Repository<AssignGeneralOffer>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly individualService: IndividualService,
    protected readonly companyService: CompanyService,
    protected readonly studentActivityService: StudentActivityService,
    protected readonly generalOfferService: GeneralOfferService,
  ) {}

  // Create a new record
  async create(create: CreateAssignGeneralOfferDto): Promise<AssignGeneralOffer> {
    const generalOffer = await this.generalOfferService.findOne(create.offer_id);

    if (!generalOffer) {
      throw new NotFoundException(`${generalOffer} with  not found`);
    }

    let customer;

    switch (create.type_user) {
      case TypeUser.Individual:
        customer = await this.individualService.findOne(create.customer_id);
        break;
      case TypeUser.Company:
        customer = await this.companyService.findOne(create.customer_id);
        break;
      case TypeUser.StudentActivity:
        customer = await this.studentActivityService.findOne(create.customer_id);
        break;
      default:
        throw new Error("Invalid user type");
    }

    const assignGeneralOffer = this.assignGeneralOfferRepository.create({
      ...create,
      [create.type_user.toLowerCase()]: customer,
      generalOffer,
    });
    return await this.assignGeneralOfferRepository.save(assignGeneralOffer);
  }

  // Get all records
  async findAll(filterData) {
    const filteredRecord = await this.apiFeaturesService
      .setRepository(AssignGeneralOffer)
      .getFilteredData(filterData);
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }

  // Get a single record by ID
  async findOne(id: number): Promise<AssignGeneralOffer> {
    const assignGeneralOffer = await this.assignGeneralOfferRepository.findOne({ where: { id } });
    if (!assignGeneralOffer) {
      throw new NotFoundException(`AssignGeneralOffer with id ${id} not found`);
    }
    return assignGeneralOffer;
  }

  // Update a record
  async update(updateAssignGeneralOfferDto: UpdateAssignGeneralOfferDto) {
    await this.assignGeneralOfferRepository.update(
      updateAssignGeneralOfferDto.id,
      updateAssignGeneralOfferDto,
    );
    return this.assignGeneralOfferRepository.findOne({
      where: { id: updateAssignGeneralOfferDto.id },
    });
  }

  // Delete a record
  async remove(id: number) {
    await this.assignGeneralOfferRepository.delete(id);
  }
}
