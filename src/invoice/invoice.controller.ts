import { Body, Controller, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { CustomSettingsService } from "src/custom-settings/custom-settings.service";
import { GeneralSettingsService } from "src/general-settings/settings.service";
import { Invoice } from "src/shared/interface/invoice.interface";
import { InvoiceService } from "./invoice.service";

@Controller("invoice")
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly generalSettingsService: GeneralSettingsService,
    private readonly customSettingsService: CustomSettingsService,
  ) {}

  @Post("send")
  async sendInvoice(@Body() invoice: Invoice, @Req() req: Request) {
    const customer_type = req["customer_type"];
    const customer = req[customer_type];
    const createdBy = req["createdBy"];
    const hasSettingSpecial = invoice.hasSettingSpecial;

    const settings = await this.getSettingsForInvoice(invoice, customer_type);

    const customerInfo =
      customer_type && customer
        ? {
            customer_id: invoice.customer_id,
            customer_type,
            customer,
            createdBy,
            hasSettingSpecial,
          }
        : undefined;

    return await this.invoiceService.sendInvoice(invoice, customerInfo, settings);
  }

  private async getSettingsForInvoice(invoice: Invoice, customer_type: string) {
    const { hasSettingSpecial, customer_id } = invoice;

    if (!hasSettingSpecial) {
      return await this.generalSettingsService.findAll({});
    }

    try {
      return await this.customSettingsService.getSettingsForUser(
        customer_type as "individual" | "company" | "studentActivity",
        customer_id,
      );
    } catch (error) {
      console.warn(`Failed to get custom settings for user ${customer_id}:`, error);
      return await this.generalSettingsService.findAll({});
    }
  }
}
