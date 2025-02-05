import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingProvider } from "src/auth/providers/hashing.provider";
import { Role } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { PatchUserDto } from "./dtos/patch-user.dto";
import {
  ACCOUNTANT,
  COMMUNITY_OFFICER,
  FOUNDER,
  GENERALMANGER,
  OPERATIONMANGER,
  SALES,
} from "./permissions-default";
import { User } from "./user.entity";
@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
    private readonly apiFeaturesService: APIFeaturesService,
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  public async findAll(filterData: any) {
    const queryBuilder = this.apiFeaturesService.setRepository(User).buildQuery(filterData);
    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  public async findList() {
    const users = await this.repository.find({});
    return {
      data: users,
    };
  }

  public async findOneById(id: number): Promise<User> {
    const user = await this.repository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`${user} with id ${id} not found`);
    }
    return user;
  }

  public async findOneByEmail(email: string) {
    const user = await this.repository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException(`${user} with  ${email} not found`);
    }
    return user;
  }

  public async createUser(createUserDto: CreateUserDto) {
    delete createUserDto.password_confirmation;

    const rolePermissionsMap = {
      [Role.FOUNDER]: FOUNDER,
      [Role.GENERAL_MANAGER]: GENERALMANGER,
      [Role.OPERATION_MANAGER]: OPERATIONMANGER,
      [Role.COMMUNITY_OFFICER]: COMMUNITY_OFFICER,
      [Role.ACCOUNTANT]: ACCOUNTANT,
      [Role.SALES]: SALES,
    };

    createUserDto.permission = rolePermissionsMap[createUserDto.role] || null;
    createUserDto.password = await this.hashingProvider.hashPassword(createUserDto.password);
    const newUser = this.repository.create(createUserDto);
    const user = await this.repository.save(newUser);
    delete user.password;
    return user;
  }

  async updateUser(patch: PatchUserDto) {
    if (patch.password) {
      patch.password = await this.hashingProvider.hashPassword(patch.password);
      delete patch.password_confirmation;
    }

    await this.repository.update(patch.id, patch);
    const user = await this.repository.findOne({ where: { id: patch.id } });
    delete user.password;
    return user;
  }

  public async delete(userId: number) {
    await this.repository.delete(userId);
    return { deleted: true, userId };
  }
}
