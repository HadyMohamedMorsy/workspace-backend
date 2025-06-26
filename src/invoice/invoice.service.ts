import { Injectable } from "@nestjs/common";
import { AssignGeneralOfferservice } from "src/assignes-global-offers/assignes-general-offer.service";
import { GeneralOfferService } from "src/general-offer/generalOffer.service";
import { GeneralSettingsService } from "src/general-settings/settings.service";
import { OrdersService } from "src/orders/orders.service";
import { DeskareaService } from "src/reservations/deskarea/deskarea.service";
import {
  calculateDiscount,
  getPriceCoWorkingSpace,
  getTotalTime,
  Offer,
} from "src/reservations/helpers/client.utils";
import { ReservationRoomService } from "src/reservations/rooms/reservation-room.service";
import { SharedService } from "src/reservations/shared/shared.service";
import {
  PaymentMethod,
  ReservationStatus,
  TimeOfDay,
  TypeOrder,
} from "src/shared/enum/global-enum";
import { Invoice } from "src/shared/interface/invoice.interface";

@Injectable()
export class InvoiceService {
  constructor(
    private readonly orderService: OrdersService,
    private readonly sharedService: SharedService,
    private readonly roomService: ReservationRoomService,
    private readonly deskareaService: DeskareaService,
    private readonly generalSettingsService: GeneralSettingsService,
    private readonly assignGeneralOfferService: AssignGeneralOfferservice,
    private readonly generalOfferService: GeneralOfferService,
  ) {}

  private async processOfferIfExists(
    offer_id: number | undefined,
    customerInfo?: { customer_id: number; customer_type: string; customer: any; createdBy: any },
  ) {
    if (!offer_id || !customerInfo) return;

    // Find the general offer
    const generalOffer = await this.generalOfferService.findOne(offer_id);
    if (generalOffer) {
      // Determine customer type and create AssignGeneralOffer
      const assignGeneralOfferData: any = {
        generalOffer: generalOffer,
        createdBy: customerInfo.createdBy,
      };

      // Add the appropriate customer based on customer_type
      assignGeneralOfferData[customerInfo.customer_type] = customerInfo.customer;

      // Create AssignGeneralOffer
      await this.assignGeneralOfferService.create(assignGeneralOfferData);
    }
  }

  async sendInvoice(
    invoice: Invoice,
    customerInfo?: { customer_id: number; customer_type: string; customer: any; createdBy: any },
  ) {
    const settings = await this.generalSettingsService.findAll({});
    // Handle orders
    if (invoice.order?.length) {
      await Promise.all(
        invoice.order.map(order =>
          this.orderService.update({
            id: order.id,
            type_order: TypeOrder.PAID,
            payment_method: order.payment_method || PaymentMethod.Cach,
          }),
        ),
      );
    }

    // Handle shared reservations
    if (invoice.shared?.length) {
      await Promise.all(
        invoice.shared.map(async shared => {
          // Process offer if exists
          await this.processOfferIfExists(shared.offer_id, customerInfo);

          const total_time =
            shared.is_membership === "no"
              ? getTotalTime(shared.total_time, shared.is_full_day, +settings.full_day_hours)
              : 0;

          const basePrice =
            getPriceCoWorkingSpace(
              {
                ...shared,
                is_full_day: shared.is_full_day || shared.total_time > +settings.full_day_hours,
              },
              "shared",
              settings,
            ) * total_time;

          const discount = calculateDiscount(basePrice, {
            id: shared.id.toString(),
            type: shared.offer_type as "PERCENTAGE" | "AMOUNT",
            value: shared.discount_amount,
          } as Offer);

          const finalPrice = basePrice - discount;

          this.sharedService.update({
            id: shared.id,
            status:
              shared.status === ReservationStatus.ACTIVE
                ? ReservationStatus.COMPLETE
                : ReservationStatus.CANCELLED,
            payment_method: shared.payment_method as PaymentMethod,
            total_time: shared.total_time,
            end_hour: shared.end_hour,
            end_minute: shared.end_minute,
            total_price:
              shared.status === ReservationStatus.CANCELLED ? 0 : finalPrice < 0 ? 0 : finalPrice,
            is_full_day: shared.is_full_day || shared.total_time > +settings.full_day_hours,
            end_time: shared.end_time as TimeOfDay,
          });
        }),
      );
    }

    // Handle deskarea reservations
    if (invoice.deskarea?.length) {
      await Promise.all(
        invoice.deskarea.map(async deskarea => {
          // Process offer if exists
          await this.processOfferIfExists(deskarea.offer_id, customerInfo);

          const total_time =
            deskarea.is_membership === "no"
              ? getTotalTime(deskarea.total_time, deskarea.is_full_day, +settings.full_day_hours)
              : 0;

          const basePrice =
            getPriceCoWorkingSpace(
              {
                ...deskarea,
                is_full_day: deskarea.is_full_day || deskarea.total_time > +settings.full_day_hours,
              },
              "deskarea",
              settings,
            ) * total_time;

          const discount = calculateDiscount(basePrice, {
            id: deskarea.id.toString(),
            type: deskarea.offer_type as "PERCENTAGE" | "AMOUNT",
            value: deskarea.discount_amount,
          } as Offer);

          const finalPrice = basePrice - discount;

          this.deskareaService.update({
            id: deskarea.id,
            status:
              deskarea.status === ReservationStatus.ACTIVE
                ? ReservationStatus.COMPLETE
                : ReservationStatus.CANCELLED,
            total_time: deskarea.total_time,
            end_hour: deskarea.end_hour,
            end_minute: deskarea.end_minute,
            payment_method: deskarea.payment_method as PaymentMethod,
            total_price:
              deskarea.status === ReservationStatus.CANCELLED ? 0 : finalPrice < 0 ? 0 : finalPrice,
            is_full_day: deskarea.is_full_day || deskarea.total_time > +settings.full_day_hours,
            end_time: deskarea.end_time as TimeOfDay,
          });
        }),
      );
    }

    if (invoice.room?.length) {
      await Promise.all(
        invoice.room.map(async room => {
          // Process offer if exists
          await this.processOfferIfExists(room.offer_id, customerInfo);

          const basePrice =
            room.is_deal === "no" || room.is_package === "no"
              ? +room.original_price * room.total_time
              : 0;

          const discount = calculateDiscount(basePrice, {
            id: room.id.toString(),
            type: room.offer_type as "PERCENTAGE" | "AMOUNT",
            value: room.discount_amount,
          } as Offer);

          const finalPrice = basePrice - discount;

          this.roomService.update({
            id: room.id,
            status:
              room.status === ReservationStatus.ACTIVE
                ? ReservationStatus.COMPLETE
                : ReservationStatus.CANCELLED,
            payment_method: room.payment_method,
            total_time: room.total_time,
            end_hour: room.end_hour,
            end_minute: room.end_minute,
            total_price:
              room.status === ReservationStatus.CANCELLED ? 0 : finalPrice < 0 ? 0 : finalPrice,
            end_time: room.end_time as TimeOfDay,
          });
        }),
      );
    }
    return {
      data: {
        message: "Invoice processed successfully",
      },
    };
  }
}
