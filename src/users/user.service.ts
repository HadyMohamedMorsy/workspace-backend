import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingProvider } from "src/auth/providers/hashing.provider";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { PatchUserDto } from "./dtos/patch-user.dto";
import { Role } from "./enum/roles-enum";
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
    this.apiFeaturesService.setRepository(User);
    const filteredRecords = await this.apiFeaturesService.getFilteredData(filterData);
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredRecords,
      recordsFiltered: filteredRecords.length,
      totalRecords: +totalRecords,
    };
  }

  public async findOneById(id: number): Promise<User> {
    let user = undefined;

    try {
      user = await this.repository.findOneBy({
        id,
      });
    } catch (err) {
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
        {
          description: `Error connecting to the the datbase ${err}`,
        },
      );
    }

    if (!user) {
      throw new BadRequestException("The user id does not exist");
    }

    return user;
  }

  public async findOneByEmail(email: string) {
    let user: User | undefined = undefined;
    try {
      user = await this.repository.findOne({
        where: { email },
      });
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: "Could not fetch the user",
      });
    }

    if (!user) {
      throw new UnauthorizedException("User does not exists");
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
    try {
      createUserDto.password = await this.hashingProvider.hashPassword(createUserDto.password);
      const newUser = this.repository.create(createUserDto);
      const user = await this.repository.save(newUser);
      delete user.password;
      return user;
    } catch (error) {
      if (error.code === "23505") {
        if (error.constraint === "UQ_8e1f623798118e629b46a9e6299") {
          throw new ConflictException("The phone number is already taken.");
        }
      }
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
        {
          description: `Error connecting to the the datbase ${error}`,
        },
      );
    }
  }

  async updateUser(patch: PatchUserDto) {
    if (patch.password) {
      patch.password = await this.hashingProvider.hashPassword(patch.password);
      delete patch.password_confirmation;
    }

    try {
      await this.repository.update(patch.id, patch);
      const user = await this.repository.findOne({ where: { id: patch.id } });
      delete user.password;
      return user;
    } catch (error) {
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
        {
          description: `Error connecting to the the datbase ${error}`,
        },
      );
    }
  }

  public async delete(id: number) {
    await this.repository.delete(id);
    return { deleted: true, id };
  }
}
