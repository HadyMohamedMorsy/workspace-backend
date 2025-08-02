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
      .leftJoin("e.nationality", "n")
      .leftJoin("e.college", "c")
      .leftJoin("e.unviresty", "u")
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
        "rr.status IN (:...room_statuses) AND rr.selected_day = :today",
        {
          room_statuses: [ReservationStatus.PENDING, ReservationStatus.ACTIVE],
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
        "rr.status",
        "rr.selected_day",
        "da.id",
        "s.id",
        "n.name",
        "c.name",
        "u.name",
        "n.id",
        "c.id",
        "u.id",
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

    if (filterData?.unviresty_id) {
      queryBuilder.andWhere("u.id = :unviresty", { unviresty: filterData.unviresty_id });
    }

    if (filterData?.college_id) {
      queryBuilder.andWhere("c.id = :college", { college: filterData.college_id });
    }

    if (filterData?.nationality_id) {
      queryBuilder.andWhere("n.id = :nationality", { nationality: filterData.nationality_id });
    }

    // Filter by invoice status
    if (filterData?.invoice_filter) {
      switch (filterData.invoice_filter) {
        case "invoice":
          // Get individuals who have current active services that would generate an invoice
          queryBuilder.andWhere(
            `(s.status = :status_shared OR da.status = :status_deskarea OR rr.id IS NOT NULL OR eo.type_order = :typeOrder)`,
            {
              status_shared: ReservationStatus.ACTIVE,
              status_deskarea: ReservationStatus.ACTIVE,
              room_statuses: [ReservationStatus.ACTIVE, ReservationStatus.PENDING],
              typeOrder: "HOLD",
            },
          );
          break;

        case "not_invoice":
          // Get individuals who don't have any current active services
          queryBuilder.andWhere(
            `(s.id IS NULL OR s.status != :status_shared) AND (da.id IS NULL OR da.status != :status_deskarea) AND rr.id IS NULL AND (eo.id IS NULL OR eo.type_order != :typeOrder)`,
            {
              status_shared: ReservationStatus.ACTIVE,
              status_deskarea: ReservationStatus.ACTIVE,
              room_statuses: [ReservationStatus.ACTIVE, ReservationStatus.PENDING],
              typeOrder: "HOLD",
            },
          );
          break;

        case "invoice_shared":
          // Get individuals who have active shared spaces
          queryBuilder.andWhere(`s.status = :status_shared`, {
            status_shared: ReservationStatus.ACTIVE,
          });
          break;

        case "invoice_deskarea":
          // Get individuals who have active deskarea
          queryBuilder.andWhere(`da.status = :status_deskarea`, {
            status_deskarea: ReservationStatus.ACTIVE,
          });
          break;

        case "invoice_reservation_room":
          // Get individuals who have active or pending reservation rooms
          queryBuilder.andWhere(`rr.id IS NOT NULL AND rr.status IN (:...room_statuses)`, {
            room_statuses: [ReservationStatus.ACTIVE, ReservationStatus.PENDING],
          });
          break;

        case "invoice_order":
          queryBuilder.andWhere(`eo.id IS NOT NULL AND eo.type_order = :typeOrder`, {
            typeOrder: "HOLD",
          });
          break;

        default:
          // No additional filtering for unknown invoice_filter values
          break;
      }
    }

    if (filterData?.package) {
      switch (filterData.package) {
        case "package_room": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere("pa.id IS NOT NULL AND es.end_date >= :currentDate", {
            currentDate: today,
          });
          break;
        }
        case "membership_deskarea": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere(
            "ep.id IS NOT NULL AND ms.type = :membershipType AND ep.end_date >= :currentDate",
            {
              membershipType: "deskarea",
              currentDate: today,
            },
          );
          break;
        }
        case "membership_shared": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere(
            "ep.id IS NOT NULL AND ms.type = :membershipType AND ep.end_date >= :currentDate",
            {
              membershipType: "shared",
              currentDate: today,
            },
          );
          break;
        }
        case "deal_room": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere("d.id IS NOT NULL AND d.end_date >= :currentDate", {
            currentDate: today,
          });
          break;
        }
        case "expired_membership_deskarea": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere(
            "ep.id IS NOT NULL AND ms.type = :membershipType AND ep.end_date < :currentDate",
            {
              membershipType: "deskarea",
              currentDate: today,
            },
          );
          break;
        }
        case "expired_membership_shared": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere(
            "ep.id IS NOT NULL AND ms.type = :membershipType AND ep.end_date < :currentDate",
            {
              membershipType: "shared",
              currentDate: today,
            },
          );
          break;
        }
        case "expired_deal_room": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere(
            "d.id IS NOT NULL AND pr.id IS NOT NULL AND d.end_date < :currentDate",
            {
              currentDate: today,
            },
          );
          break;
        }
        case "expired_package_room": {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          queryBuilder.andWhere(
            "pa.id IS NOT NULL AND pr.id IS NOT NULL AND es.end_date < :currentDate",
            {
              currentDate: today,
            },
          );
          break;
        }
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
        is_pending_room:
          reservationRooms?.some(room => room.status === ReservationStatus.PENDING) || false,
        has_multiple_room_pending:
          reservationRooms?.filter(room => room.status === ReservationStatus.PENDING).length > 1,
        is_active_room:
          reservationRooms?.some(room => room.status === ReservationStatus.ACTIVE) || false,
        reservation_room_id:
          reservationRooms?.filter(room => room.status === ReservationStatus.PENDING)?.[0]?.id ||
          null,
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

  async findIndividualAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      filterField: "all",
    });
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
        .leftJoin(
          "e.assignesPackages",
          "assignesPackages",
          "assignesPackages.status = :status_package",
          {
            status_package: ReservationStatus.ACTIVE,
          },
        )
        .leftJoin("e.deals", "deals", "deals.status = :status_deal", {
          status_deal: ReservationStatus.ACTIVE,
        })
        .leftJoin("e.assign_memberships", "am", "am.status = :status_member", {
          status_member: ReservationStatus.ACTIVE,
        })
        .leftJoin("am.memeberShip", "ms")
        .leftJoin("e.customSettings", "cs", "cs.is_active = :is_active", {
          is_active: true,
        })
        .where("e.id = :id", { id })
        .addSelect(selectingInvoice);

      const [individual, settings] = await Promise.all([
        queryBuilder.getOne(),
        this.generalSettingsService.findAll({}),
      ]);

      const {
        shared,
        deskarea,
        orders,
        reservationRooms,
        assign_memberships,
        assignesPackages,
        deals,
        customSettings,
      } = individual;

      // Get active custom settings if available
      const activeCustomSettings = customSettings?.find(cs => cs.is_active);
      const membershipType = assign_memberships?.[0]?.memeberShip?.type || "";
      const hasMembership = Boolean(assign_memberships?.length);
      const hasPackage = Boolean(individual.assignesPackages?.length);
      const hasDeal = Boolean(individual.deals?.length);
      const lastTimeMembership =
        hasMembership && assign_memberships?.[0]?.used === assign_memberships?.[0]?.total_used;
      const lastTimePackage =
        hasPackage && assignesPackages?.[0]?.used === assignesPackages?.[0]?.total_used;
      const lastTimeDeal = hasDeal && deals?.[0]?.used === deals?.[0]?.total_used;

      return {
        data: {
          shared: (shared || []).map(item =>
            formatItem(
              {
                ...item,
                lastTimeMembership,
                assign_membership_id: assign_memberships?.[0]?.id,
                has_setting_special: activeCustomSettings && activeCustomSettings.is_active,
              },
              "shared",
              activeCustomSettings && activeCustomSettings.is_active
                ? activeCustomSettings
                : settings,
              hasMembership,
              membershipType,
            ),
          ),
          deskarea: (deskarea || []).map(item =>
            formatItem(
              {
                ...item,
                lastTimeMembership,
                assign_membership_id: assign_memberships?.[0]?.id,
                had_: activeCustomSettings && activeCustomSettings.is_active,
              },
              "deskarea",
              activeCustomSettings && activeCustomSettings.is_active
                ? activeCustomSettings
                : settings,
              hasMembership,
              membershipType,
            ),
          ),
          order: Array.isArray(orders) ? orders.map(formatOrderData) : [],
          room: (reservationRooms || [])
            .map(room => {
              const customRoomPrice = activeCustomSettings?.rooms?.find(r => r.id === room.room.id);
              return formatRoom(
                {
                  ...room,
                  has_setting_special: activeCustomSettings && activeCustomSettings.is_active,
                  price: customRoomPrice?.value || room.room.price || 0,
                  lastTimeDeal,
                  lastTimePackage,
                  assign_deal_id: deals?.[0]?.id,
                  assign_package_id: assignesPackages?.[0]?.id,
                },
                hasPackage,
                hasDeal,
              );
            })
            .filter(Boolean),
        },
      };
    } catch (error) {
      console.error("Error in checkInvoice:", error);
      return { status: false, message: "Internal server error" };
    }
  }
}
