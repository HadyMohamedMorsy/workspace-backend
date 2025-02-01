import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CompanyService } from "src/companies/company.service";
import { IndividualService } from "src/individual/individual.service";
import { OfferCoWorkingSpaceService } from "src/offer-co-working-space/offer-co-working-space.service";
import { TypeUser } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivityService } from "src/student-activity/studentActivity.service";
import { Repository } from "typeorm";
import { AssignesMembership } from "./assignes-membership.entity";
import { CreateAssignesMembershipDto } from "./dto/create-assignes-membership.dto";
import { UpdateAssignesMembershipDto } from "./dto/update-assignes-membership.dto";

@Injectable()
export class AssignesMembershipService {
  constructor(
    @InjectRepository(AssignesMembership)
    private assignesMembershipRepository: Repository<AssignesMembership>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly individualService: IndividualService,
    protected readonly companyService: CompanyService,
    protected readonly studentActivityService: StudentActivityService,
    protected readonly offerCoWorkingSpaceService: OfferCoWorkingSpaceService,
  ) {}

  // Create a new record
  async create(create: CreateAssignesMembershipDto): Promise<AssignesMembership> {
    const memeberShip = await this.offerCoWorkingSpaceService.findOne(create.membership_id);

    if (!memeberShip) {
      throw new NotFoundException(`${memeberShip} with  not found`);
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

    const assignesMembership = this.assignesMembershipRepository.create({
      ...create,
      [create.type_user.toLowerCase()]: customer,
      memeberShip,
    });

    return await this.assignesMembershipRepository.save(assignesMembership);
  }

  // Get all records
  async findAll(filterData) {
    const filteredRecord = await this.apiFeaturesService
      .setRepository(AssignesMembership)
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
  async findOne(id: number): Promise<AssignesMembership> {
    const assignesMembership = await this.assignesMembershipRepository.findOne({ where: { id } });
    if (!assignesMembership) {
      throw new NotFoundException(`AssignesMembership with id ${id} not found`);
    }
    return assignesMembership;
  }

  // Update a record
  async update(updateAssignesMembershipDto: UpdateAssignesMembershipDto) {
    await this.assignesMembershipRepository.update(
      updateAssignesMembershipDto.id,
      updateAssignesMembershipDto,
    );
    return this.assignesMembershipRepository.findOne({
      where: { id: updateAssignesMembershipDto.id },
    });
  }

  // Delete a record
  async remove(id: number) {
    await this.assignesMembershipRepository.delete(id);
  }
}
