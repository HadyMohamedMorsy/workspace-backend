import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { Repository } from "typeorm";
import { Deskarea } from "./deskarea.entity"; // Changed from Company to Deskarea
import { CreateDeskAreaDto } from "./dto/create-deskarea.dto";
import { UpdateDeskAreaDto } from "./dto/update-returns.dto";

@Injectable()
export class DeskareaService {
  constructor(
    @InjectRepository(Deskarea)
    private deskareaRepository: Repository<Deskarea>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {}

  // Create a new deskarea
  async create(createDeskareaDto: CreateDeskAreaDto) {
    const deskarea = this.deskareaRepository.create(createDeskareaDto);
    return await this.deskareaRepository.save(deskarea);
  }

  // Get all deskareas
  async findAll(filterData) {
    const filteredRecord = await this.apiFeaturesService
      .setRepository(Deskarea)
      .getFilteredData(filterData);
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get deskarea by ID
  async findOne(id: number): Promise<Deskarea> {
    const deskarea = await this.deskareaRepository.findOne({ where: { id } });
    if (!deskarea) {
      throw new NotFoundException(`${deskarea} with id ${id} not found`);
    }
    return deskarea;
  }

  // Update a deskarea
  async update(updateDeskareaDto: UpdateDeskAreaDto) {
    await this.deskareaRepository.update(updateDeskareaDto.id, updateDeskareaDto);
    return this.deskareaRepository.findOne({ where: { id: updateDeskareaDto.id } });
  }

  // Delete a deskarea
  async remove(deskareaId: number) {
    await this.deskareaRepository.delete(deskareaId);
  }
}
