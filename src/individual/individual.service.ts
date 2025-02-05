import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssignGeneralOfferservice } from "src/assignes-global-offers/assignes-general-offer.service";
import { AssignesMembershipModule } from "src/assignes-memberships/assignes-membership.module";
import { AssignesPackagesService } from "src/assigness-packages-offers/assignes-packages.service";
import { OrdersService } from "src/orders/orders.service";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateIndividualDto } from "./dto/create-individual.dto";
import { UpdateIndividualDto } from "./dto/update-individual.dto";
import { Individual } from "./individual.entity";

@Injectable()
export class IndividualService {
  constructor(
    @InjectRepository(Individual)
    private individualRepository: Repository<Individual>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly assignesPackagesService: AssignesPackagesService,
    protected readonly assignGeneralOfferservice: AssignGeneralOfferservice,
    protected readonly assignesMembershipModule: AssignesMembershipModule,
    protected readonly ordersService: OrdersService,
  ) {}

  // Create a new record
  async create(createIndividualDto: CreateIndividualDto): Promise<Individual> {
    const individual = this.individualRepository.create(createIndividualDto);
    return await this.individualRepository.save(individual);
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Individual).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.assign_memberships", "ep", "ep.status = :status_memeber", {
        status_memeber: ReservationStatus.ACTIVE,
      })
      .leftJoinAndSelect("ep.memeberShip", "ms")
      .leftJoinAndSelect("e.assignesPackages", "es", "es.status = :status_package", {
        status_package: ReservationStatus.ACTIVE,
      })
      .leftJoinAndSelect("es.packages", "pa")
      .leftJoinAndSelect("pa.room", "pr");

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const results = {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };

    return results;
  }

  async findOne(id: number): Promise<Individual> {
    const individual = await this.individualRepository.findOne({ where: { id } });
    if (!individual) {
      throw new NotFoundException(`${individual} with id ${id} not found`);
    }
    return individual;
  }

  async update(updateIndividualDto: UpdateIndividualDto) {
    await this.individualRepository.update(updateIndividualDto.id, updateIndividualDto);
    return this.individualRepository.findOne({ where: { id: updateIndividualDto.id } });
  }

  async remove(id: number) {
    await this.individualRepository.delete(id);
  }
}
