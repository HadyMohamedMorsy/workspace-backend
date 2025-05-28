import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateStudentActivityDto } from "./dto/create-StudentActivity.dto";
import { UpdateStudentActivityDto } from "./dto/update-StudentActivity.dto";
import { StudentActivity } from "./StudentActivity.entity";

@Injectable()
export class StudentActivityService
  extends BaseService<StudentActivity, CreateStudentActivityDto, UpdateStudentActivityDto>
  implements ICrudService<StudentActivity, CreateStudentActivityDto, UpdateStudentActivityDto>
{
  constructor(
    @InjectRepository(StudentActivity)
    repository: Repository<StudentActivity>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoin("e.assign_memberships", "ep", "ep.status = :status_memeber", {
        status_memeber: ReservationStatus.ACTIVE,
      })
      .leftJoin("ep.memeberShip", "ms")
      .leftJoin("e.assignesPackages", "es", "es.status = :status_package", {
        status_package: ReservationStatus.ACTIVE,
      })
      .leftJoin("es.packages", "pa")
      .leftJoin("pa.room", "pr")
      .leftJoin("e.orders", "eo", "eo.type_order = :typeOrder", {
        typeOrder: "HOLD",
      })
      .addSelect([
        "ep.id",
        "ep.start_date",
        "ep.end_date",
        "ep.used",
        "ep.remaining",
        "ep.status",
        "ms.id",
        "ms.name",
        "ms.days",
        "ms.price",
        "ms.type",
        "es.id",
        "es.start_date",
        "es.end_date",
        "es.used",
        "es.remaining",
        "pa.id",
        "pa.name",
        "pa.price",
        "pa.hours",
        "pr.id",
        "pr.name",
        "pr.price",
        "eo.id",
        "eo.type_order",
      ]);
  }

  async findByUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService
      .setRepository(StudentActivity)
      .buildQuery(filterData);

    queryBuilder.andWhere("ec.id = :user_id", { user_id: filterData.user_id });

    this.queryRelationIndex(queryBuilder);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return this.response(filteredRecord, totalRecords);
  }
}
