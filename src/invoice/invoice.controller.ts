import { Body, Controller, Post } from "@nestjs/common";
import { Invoice } from "src/shared/interface/invoice.interface";
import { InvoiceService } from "./invoice.service";

@Controller("invoice")
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post("send")
  async sendInvoice(@Body() invoice: Invoice) {
    return await this.invoiceService.sendInvoice(invoice);
  }
}
