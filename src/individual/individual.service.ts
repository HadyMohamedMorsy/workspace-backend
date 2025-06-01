import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { GeneralSettingsService } from "src/general-settings/settings.service";
import {
  formatOfferData,
  formatOrderData,
  formatRoomData,
  formatTimeData,
} from "src/reservations/helpers/client.utils";
import { BaseService } from "src/shared/base/base";
import { ReservationStatus } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateIndividualDto } from "./dto/create-individual.dto";
import { UpdateIndividualDto } from "./dto/update-individual.dto";
import { Individual } from "./individual.entity";

@Injectable()
export class IndividualService
  extends BaseService<Individual, CreateIndividualDto, UpdateIndividualDto>
  implements ICrudService<Individual, CreateIndividualDto, UpdateIndividualDto>
{
  constructor(
    @InjectRepository(Individual)
    repository: Repository<Individual>,
    protected readonly apiFeaturesService: APIFeaturesService,
    private readonly generalSettingsService: GeneralSettingsService,
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
      .leftJoin("e.deals", "d", "d.status = :status_deal", {
        status_deal: ReservationStatus.ACTIVE,
      })
      .leftJoin("e.shared", "s", "s.status = :status_shared AND s.assignessMemebership IS NULL", {
        status_shared: ReservationStatus.ACTIVE,
      })
      .leftJoin(
        "e.deskarea",
        "da",
        "da.status = :status_deskarea AND da.assignessMemebership IS NULL",
        {
          status_deskarea: ReservationStatus.ACTIVE,
        },
      )
      .leftJoin(
        "e.reservationRooms",
        "rr",
        "rr.status = :status_room AND rr.deals IS NULL AND rr.assignesPackages IS NULL",
        {
          status_room: ReservationStatus.ACTIVE,
        },
      )
      .leftJoin("e.orders", "eo", "eo.type_order = :typeOrder", {
        typeOrder: "HOLD",
      })
      .addSelect([
        "ep.id",
        "ms.id",
        "ms.name",
        "ms.days",
        "ms.price",
        "ms.type",
        "es.id",
        "pa.id",
        "pa.name",
        "pa.price",
        "pa.hours",
        "pr.id",
        "pr.name",
        "pr.price",
        "eo.id",
        "d.id",
        "rr.id",
        "da.id",
        "s.id",
      ]);
  }

  override async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Individual).buildQuery(filterData);

    const dateFilter = {
      new: { operator: ">=", date: moment().startOf("day").toDate() },
      old: { operator: "<", date: moment().startOf("day").toDate() },
    };

    this.queryRelationIndex(queryBuilder);

    if (dateFilter[filterData?.sort_customers]) {
      const { operator, date } = dateFilter[filterData?.sort_customers];
      queryBuilder.andWhere(`e.created_at ${operator} :date`, { date });
    }

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    const data = filteredRecord.map((item: any) => {
      const {
        assign_memberships,
        assignesPackages,
        orders,
        deals,
        shared,
        deskarea,
        reservationRooms,
        ...rest
      } = item;
      return {
        ...rest,
        is_member_shared:
          assign_memberships?.length && assign_memberships[0]?.memeberShip?.type === "shared",
        is_member_deskarea:
          assign_memberships?.length && assign_memberships[0]?.memeberShip?.type === "deskarea",
        is_package: assignesPackages?.length > 0,
        is_order: orders?.length > 0,
        is_deal: deals?.length > 0,
        is_shared: shared?.length > 0,
        is_deskarea: deskarea?.length > 0,
        is_reservation_room: reservationRooms?.length > 0,
      };
    });

    return this.response(data, totalRecords);
  }

  async findByUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Individual).buildQuery(filterData);

    queryBuilder.andWhere("ec.id = :user_id", { user_id: filterData.user_id });

    this.queryRelationIndex(queryBuilder);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return this.response(filteredRecord, totalRecords);
  }

  async checkInvoice(id: string) {
    const queryBuilder = this.repository.createQueryBuilder("e");

    queryBuilder
      .leftJoin("e.shared", "s", "s.status = :status_shared", {
        status_shared: ReservationStatus.ACTIVE,
      })
      .leftJoin("e.deskarea", "d", "d.status = :status_deskarea", {
        status_deskarea: ReservationStatus.ACTIVE,
      })
      .leftJoin("e.orders", "eo", "eo.type_order = :typeOrder", {
        typeOrder: "HOLD",
      })
      .leftJoin("e.reservationRooms", "r", "r.status = :status_room", {
        status_room: ReservationStatus.ACTIVE,
      })
      .leftJoin("s.assignGeneralOffer", "sgo")
      .leftJoin("sgo.generalOffer", "sgo_offer")
      .leftJoin("d.assignGeneralOffer", "dgo")
      .leftJoin("dgo.generalOffer", "dgo_offer")
      .leftJoin("r.assignGeneralOffer", "rgo")
      .leftJoin("rgo.generalOffer", "rgo_offer")
      .where("e.id = :id", { id })
      .addSelect([
        "s.id",
        "s.start_time",
        "s.start_hour",
        "s.start_minute",
        "s.end_time",
        "s.end_hour",
        "s.end_minute",
        "s.total_price",
        "s.total_time",
        "s.is_full_day",
        "s.selected_day",
        "sgo.id",
        "sgo_offer.id",
        "sgo_offer.type_discount",
        "sgo_offer.discount",
        "d.id",
        "d.start_time",
        "d.start_hour",
        "d.start_minute",
        "d.end_time",
        "d.end_hour",
        "d.end_minute",
        "d.total_price",
        "d.total_time",
        "d.is_full_day",
        "d.selected_day",
        "dgo.id",
        "dgo_offer.id",
        "dgo_offer.type_discount",
        "dgo_offer.discount",
        "eo.id",
        "eo.order_number",
        "eo.order_price",
        "eo.total_order",
        "r.id",
        "r.start_time",
        "r.start_hour",
        "r.start_minute",
        "r.end_time",
        "r.end_hour",
        "r.end_minute",
        "r.total_price",
        "r.total_time",
        "r.selected_day",
        "rgo.id",
        "rgo_offer.id",
        "rgo_offer.type_discount",
        "rgo_offer.discount",
      ]);

    const [individual, settings] = await Promise.all([
      queryBuilder.getOne(),
      this.generalSettingsService.findAll({}),
    ]);

    if (!individual) {
      return {
        status: false,
        message: "Individual not found",
      };
    }

    const { shared, deskarea, orders, reservationRooms } = individual;

    const sharedList =
      shared?.map(share =>
        formatTimeData(
          {
            ...share,
            type: "shared",
            offer: formatOfferData(share),
          },
          settings,
        ),
      ) || [];

    const deskareaList =
      deskarea?.map(desk =>
        formatTimeData(
          {
            ...desk,
            type: "deskarea",
            offer: formatOfferData(desk),
          },
          settings,
        ),
      ) || [];

    const orderList = Array.isArray(orders) ? orders.map(order => formatOrderData(order)) : [];

    const roomList = Array.isArray(reservationRooms)
      ? reservationRooms.map(room =>
          formatRoomData(
            {
              ...room,
              offer: formatOfferData(room),
            },
            settings,
          ),
        )
      : [];

    return {
      data: {
        shared: sharedList,
        deskarea: deskareaList,
        order: orderList,
        room: roomList,
      },
    };
  }
}
