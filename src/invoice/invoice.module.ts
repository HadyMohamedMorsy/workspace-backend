import { Module } from "@nestjs/common";
import { GeneralSettingsModule } from "src/general-settings/settings.module";
import { OrdersModule } from "src/orders/orders.module";
import { DeskareaModule } from "src/reservations/deskarea/deskarea.module";
import { ReservationRoomModule } from "src/reservations/rooms/reservation-room.module";
import { SharedModule } from "src/reservations/shared/shared.module";
import { InvoiceController } from "./invoice.controller";
import { InvoiceService } from "./invoice.service";

@Module({
  imports: [
    OrdersModule,
    SharedModule,
    DeskareaModule,
    ReservationRoomModule,
    GeneralSettingsModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
