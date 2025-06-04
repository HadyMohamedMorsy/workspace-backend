import { Injectable } from "@nestjs/common";
import { GeneralSettingsService } from "src/general-settings/settings.service";
import { OrdersService } from "src/orders/orders.service";
import { DeskareaService } from "src/reservations/deskarea/deskarea.service";
import {
  calculateDiscount,
  getFullDayPrice,
  getPricePerHour,
  Offer,
} from "src/reservations/helpers/client.utils";
import { ReservationRoomService } from "src/reservations/rooms/reservation-room.service";
import { SharedService } from "src/reservations/shared/shared.service";
import { ReservationStatus, TimeOfDay, TypeOrder } from "src/shared/enum/global-enum";
import { Invoice } from "src/shared/interface/invoice.interface";

@Injectable()
export class InvoiceService {
  constructor(
    private readonly orderService: OrdersService,
    private readonly sharedService: SharedService,
    private readonly roomService: ReservationRoomService,
    private readonly deskareaService: DeskareaService,
    private readonly generalSettingsService: GeneralSettingsService,
  ) {}

  async sendInvoice(invoice: Invoice) {
    const settings = await this.generalSettingsService.findAll({});
    // Handle orders
    if (invoice.order?.length) {
      await Promise.all(
        invoice.order.map(id =>
          this.orderService.update({
            id: id.id,
            type_order: TypeOrder.PAID,
          }),
        ),
      );
    }

    // Handle shared reservations
    if (invoice.shared?.length) {
      await Promise.all(
        invoice.shared.map(async shared => {
          const basePrice = shared.is_full_day
            ? getFullDayPrice("shared", settings)
            : getPricePerHour("shared", settings) * shared.total_time;

          const discount = calculateDiscount(basePrice, {
            id: shared.id.toString(),
            type: shared.offer_type as "PERCENTAGE" | "AMOUNT",
            value: shared.discount_amount,
          } as Offer);

          const finalPrice = basePrice - discount;

          this.sharedService.update({
            id: shared.id,
            status: ReservationStatus.COMPLETE,
            total_time: shared.total_time,
            end_hour: shared.end_hour,
            end_minute: shared.end_minute,
            total_price: finalPrice,
            end_time: shared.end_time as TimeOfDay,
          });
        }),
      );
    }

    // Handle deskarea reservations
    if (invoice.deskarea?.length) {
      await Promise.all(
        invoice.deskarea.map(async deskarea => {
          const basePrice = deskarea.is_full_day
            ? getFullDayPrice("deskarea", settings)
            : getPricePerHour("deskarea", settings) * deskarea.total_time;

          const discount = calculateDiscount(basePrice, {
            id: deskarea.id.toString(),
            type: deskarea.offer_type as "PERCENTAGE" | "AMOUNT",
            value: deskarea.discount_amount,
          } as Offer);

          const finalPrice = basePrice - discount;

          this.deskareaService.update({
            id: deskarea.id,
            status: ReservationStatus.COMPLETE,
            total_time: deskarea.total_time,
            end_hour: deskarea.end_hour,
            end_minute: deskarea.end_minute,
            total_price: finalPrice,
            end_time: deskarea.end_time as TimeOfDay,
          });
        }),
      );
    }

    if (invoice.room?.length) {
      await Promise.all(
        invoice.room.map(async room => {
          const basePrice = room.is_full_day
            ? getFullDayPrice("room", settings)
            : getPricePerHour("room", settings) * room.total_time;

          const discount = calculateDiscount(basePrice, {
            id: room.id.toString(),
            type: room.offer_type as "PERCENTAGE" | "AMOUNT",
            value: room.discount_amount,
          } as Offer);

          const finalPrice = basePrice - discount;

          this.roomService.update({
            id: room.id,
            status: ReservationStatus.COMPLETE,
            total_time: room.total_time,
            end_hour: room.end_hour,
            end_minute: room.end_minute,
            total_price: finalPrice,
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
