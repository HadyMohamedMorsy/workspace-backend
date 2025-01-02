import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingProvider } from "src/auth/providers/hashing.provider";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { DeepPartial, Repository } from "typeorm";
import { CreateUserDto } from "./dtos/create-user.dto";
import { PatchUserDto } from "./dtos/patch-user.dto";
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
    const filteredProducts = await this.apiFeaturesService.getFilteredData(filterData);
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredProducts,
      recordsFiltered: filteredProducts.length,
      totalRecords: +totalRecords,
    };
  }

  public async findOneById(id: number) {
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
      // This will return null if the user is not found
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
    let existingUser = undefined;
    try {
      // Check is user exists with same email
      existingUser = await this.repository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
        {
          description: `Error connecting to the database ${error}`,
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException("The user already exists, please check your email.");
    }

    let newUser = this.repository.create({
      ...createUserDto,
      password: await this.hashingProvider.hashPassword(createUserDto.password),
    } as DeepPartial<User>);

    try {
      newUser = await this.repository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
        {
          description: `Error connecting to the the datbase ${error}`,
        },
      );
    }

    const result = await this.repository.findOne({
      where: { id: +newUser.id },
      select: ["firstName", "lastName", "email", "username", "created_at", "updated_at", "id"],
    });

    if (!result) {
      throw new NotFoundException(`Entity with ID ${newUser.id} not found`);
    }

    return result;
  }

  async updateUser(patch: PatchUserDto) {
    let existingUser = undefined;
    if (patch.email) {
      try {
        existingUser = await this.repository.findOne({
          where: { email: patch.email },
        });
      } catch (error) {
        throw new RequestTimeoutException(
          "Unable to process your request at the moment please try later",
          {
            description: `Error connecting to the database ${error}`,
          },
        );
      }

      // Handle exception
      if (existingUser) {
        throw new BadRequestException("The user already exists, please check your email.");
      }
    }

    if (patch.password) {
      patch.password = await this.hashingProvider.hashPassword(patch.password);
    }

    let updateUser = undefined;

    try {
      updateUser = await this.repository.save(patch as DeepPartial<User>);
    } catch (error) {
      throw new RequestTimeoutException(
        "Unable to process your request at the moment please try later",
        {
          description: `Error connecting to the the datbase ${error}`,
        },
      );
    }

    const result = await this.repository.findOne({
      where: { id: +updateUser.id },
      relations: ["role"],
      select: ["firstName", "lastName", "email", "username", "created_at", "updated_at", "id"],
    });

    if (!result) {
      throw new NotFoundException(`Entity with ID ${updateUser.id} not found`);
    }

    return result;
  }

  public async delete(id: number) {
    await this.repository.delete(id);
    return { deleted: true, id };
  }
}
