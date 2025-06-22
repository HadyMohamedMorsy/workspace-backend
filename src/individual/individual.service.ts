import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { GeneralSettingsService } from "src/general-settings/settings.service";
import {
  formatItem,
  formatOrderData,
  formatRoom,
  selectingInvoice,
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
      .leftJoin("e.shared", "s", "s.status = :status_shared", {
        status_shared: ReservationStatus.ACTIVE,
      })
      .leftJoin("e.deskarea", "da", "da.status = :status_deskarea", {
        status_deskarea: ReservationStatus.ACTIVE,
      })
      .leftJoin(
        "e.reservationRooms",
        "rr",
        "rr.status = :status_room AND rr.selected_day = :today",
        {
          status_room: ReservationStatus.ACTIVE,
          today: moment().format("DD/MM/YYYY"),
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

    // Filter by invoice status
    if (filterData?.invoice_filter) {
      if (filterData.invoice_filter === "invoice") {
        // Get individuals who have current active services that would generate an invoice
        queryBuilder.andWhere(
          `(s.status = :status_shared OR da.status = :status_deskarea OR rr.status = :status_room OR eo.type_order = :typeOrder)`,
          {
            status_shared: ReservationStatus.ACTIVE,
            status_deskarea: ReservationStatus.ACTIVE,
            status_room: ReservationStatus.ACTIVE,
            typeOrder: "HOLD",
          },
        );
      } else if (filterData.invoice_filter === "not_invoice") {
        // Get individuals who don't have any current active services
        queryBuilder.andWhere(
          `(s.id IS NULL OR s.status != :status_shared) AND (da.id IS NULL OR da.status != :status_deskarea) AND (rr.id IS NULL OR rr.status != :status_room) AND (eo.id IS NULL OR eo.type_order != :typeOrder)`,
          {
            status_shared: ReservationStatus.ACTIVE,
            status_deskarea: ReservationStatus.ACTIVE,
            status_room: ReservationStatus.ACTIVE,
            typeOrder: "HOLD",
          },
        );
      }
    }
    if (filterData?.package) {
      switch (filterData.package) {
        case "package_room":
          queryBuilder.andWhere("pa.id IS NOT NULL AND pr.id IS NOT NULL");
          break;
        case "membership_deskarea":
          queryBuilder.andWhere("ep.id IS NOT NULL AND ms.type = :membershipType", {
            membershipType: "deskarea",
          });
          break;
        case "membership_shared":
          queryBuilder.andWhere("ep.id IS NOT NULL AND ms.type = :membershipType", {
            membershipType: "shared",
          });
          break;
        case "deal_room":
          queryBuilder.andWhere("d.id IS NOT NULL AND pr.id IS NOT NULL");
          break;
      }
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
    try {
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
        .leftJoin(
          "e.reservationRooms",
          "r",
          "r.status = :status_room AND r.selected_day = :today",
          {
            status_room: ReservationStatus.ACTIVE,
            today: moment().format("DD/MM/YYYY"),
          },
        )
        .leftJoin("r.room", "room")
        .leftJoin("s.assignGeneralOffer", "sgo")
        .leftJoin("sgo.generalOffer", "sgo_offer")
        .leftJoin("d.assignGeneralOffer", "dgo")
        .leftJoin("dgo.generalOffer", "dgo_offer")
        .leftJoin("r.assignGeneralOffer", "rgo")
        .leftJoin("rgo.generalOffer", "rgo_offer")
        .leftJoin("e.assign_memberships", "am", "am.status = :status_member", {
          status_member: ReservationStatus.ACTIVE,
        })
        .leftJoin("am.memeberShip", "ms")
        .where("e.id = :id", { id })
        .addSelect(selectingInvoice);

      const [individual, settings] = await Promise.all([
        queryBuilder.getOne(),
        this.generalSettingsService.findAll({}),
      ]);

      if (!individual) {
        return { status: false, message: "Individual not found" };
      }

      const { shared, deskarea, orders, reservationRooms, assign_memberships } = individual;
      const membershipType = assign_memberships?.[0]?.memeberShip?.type || "";
      const hasMembership = Boolean(assign_memberships?.length);
      const hasPackage = Boolean(individual.assignesPackages?.length);
      const hasDeal = Boolean(individual.deals?.length);

      return {
        data: {
          shared: (shared || []).map(item =>
            formatItem(item, "shared", settings, hasMembership, membershipType),
          ),
          deskarea: (deskarea || []).map(item =>
            formatItem(item, "deskarea", settings, hasMembership, membershipType),
          ),
          order: Array.isArray(orders) ? orders.map(formatOrderData) : [],
          room: (reservationRooms || [])
            .map(room => formatRoom(room, hasPackage, hasDeal))
            .filter(Boolean),
        },
      };
    } catch (error) {
      console.error("Error in checkInvoice:", error);
      return { status: false, message: "Internal server error" };
    }
  }
}
