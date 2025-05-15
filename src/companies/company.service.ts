import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { Company } from "./company.entity";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Injectable()
export class CompanyService
  extends BaseService<Company, CreateCompanyDto, UpdateCompanyDto>
  implements ICrudService<Company, CreateCompanyDto, UpdateCompanyDto>
{
  constructor(
    @InjectRepository(Company)
    repository: Repository<Company>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoinAndSelect("e.assign_memberships", "ep", "ep.status = :status_memeber", {
        status_memeber: ReservationStatus.ACTIVE,
      })
      .leftJoinAndSelect("ep.memeberShip", "ms")
      .leftJoinAndSelect("e.assignesPackages", "es", "es.status = :status_package", {
        status_package: ReservationStatus.ACTIVE,
      })
      .leftJoinAndSelect("es.packages", "pa")
      .leftJoinAndSelect("pa.room", "pr")
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"])
      .leftJoinAndSelect("e.orders", "eo", "eo.type_order = :typeOrder", {
        typeOrder: "HOLD",
      });
  }

  async findByUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Company).buildQuery(filterData);

    queryBuilder
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"])
      .andWhere("ec.id = :user_id", { user_id: filterData.user_id });

    this.queryRelationIndex(queryBuilder);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return this.response(filteredRecord, totalRecords);
  }
}
