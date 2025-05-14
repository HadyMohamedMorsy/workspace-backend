import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/shared/base/base";
import { UserStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { UserDto } from "./dtos/create-user.dto";
import { PatchUserDto } from "./dtos/patch-user.dto";
import { User } from "./user.entity";

@Injectable()
export class UserService
  extends BaseService<User, UserDto, PatchUserDto>
  implements ICrudService<User, UserDto, PatchUserDto>
{
  constructor(
    apiFeaturesService: APIFeaturesService,
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository, apiFeaturesService);
  }

  public async findOneByEmail(email: string) {
    const user = await this.repository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException(`${email} not found`);
    }
    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException(`${email} is inactive`);
    }
    return user;
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder.leftJoinAndSelect("e.orders", "eo", "eo.type_order = :typeOrder", {
      typeOrder: "HOLD",
    });
  }
}
