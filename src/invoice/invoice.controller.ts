import { Body, Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { Invoice } from "src/shared/interface/invoice.interface";
import { InvoiceService } from "./invoice.service";

@Controller("invoice")
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post("send")
  async sendInvoice(@Body() invoice: Invoice, @Req() req: Request) {
    const customer_type = req["customer_type"];
    const customer = req[customer_type];
    const createdBy = req["createdBy"];

    const customerInfo =
      customer_type && customer
        ? {
            customer_id: invoice.customer_id,
            customer_type,
            customer,
            createdBy,
          }
        : undefined;

    return await this.invoiceService.sendInvoice(invoice, customerInfo);
  }
}
