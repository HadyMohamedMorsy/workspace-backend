import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { Deposite } from "./deposites.entity";
import { CreateDepositeDto } from "./dto/create-deposites.dto";
import { UpdateDepositeDto } from "./dto/update-deposites.dto";

@Injectable()
export class DepositeService {
  constructor(
    @InjectRepository(Deposite)
    private depositesRepositry: Repository<Deposite>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  async create(createDepositeDto: CreateDepositeDto) {
    const deposite = this.depositesRepositry.create(createDepositeDto);
    const newDeposite = await this.depositesRepositry.save(deposite);
    return this.findOne(newDeposite.id);
  }

  async findAll(filterData) {
    this.apiFeaturesService.setRepository(Deposite);
    const queryBuilder = this.apiFeaturesService.setRepository(Deposite).buildQuery(filterData);

    queryBuilder
      .leftJoinAndSelect("e.reservationRooms", "er")
      .leftJoinAndSelect("e.assignesPackages", "ea")
      .leftJoinAndSelect("e.assignessMemebership", "eas");

    queryBuilder.leftJoin("e.createdBy", "ec").addSelect(["ec.id", "ec.firstName", "ec.lastName"]);

    if (filterData?.customFilters?.start_date && filterData?.customFilters?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: filterData.customFilters.start_date,
        end_date: filterData.customFilters.end_date,
      });
    }

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findOne(id: number) {
    const deposite = this.depositesRepositry.findOne({ where: { id } });
    if (!deposite) {
      throw new NotFoundException(`deal with id not found`);
    }
    return deposite;
  }

  async update(updateDepositeDto: UpdateDepositeDto) {
    await this.depositesRepositry.update(updateDepositeDto.id, updateDepositeDto);
    return this.depositesRepositry.findOne({ where: { id: updateDepositeDto.id } });
  }

  async remove(id: number) {
    await this.depositesRepositry.delete(id);
  }
}
