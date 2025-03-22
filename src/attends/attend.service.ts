import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { Repository } from "typeorm";
import { Attend } from "./attend.entity";

@Injectable()
export class AttendService {
  constructor(
    @InjectRepository(Attend)
    private attendRepository: Repository<Attend>,
  ) {}

  // Create a new record
  async create() {
    const today = moment().startOf("day").toDate();

    const existing = await this.attendRepository.findOne({
      where: { date: today },
    });

    if (existing) {
      existing.attend += 1;
      return this.attendRepository.save(existing);
    }

    const newAttendance = this.attendRepository.create({
      attend: 1,
      date: today,
    });

    return this.attendRepository.save(newAttendance);
  }

  // Get all records
  async findAll() {
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    const filteredRecord = await this.attendRepository
      .createQueryBuilder("attend")
      .where("attend.date BETWEEN :start AND :end", {
        start: startOfDay,
        end: endOfDay,
      })
      .getMany();

    return filteredRecord;
  }
}
