import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { BaseService } from "src/shared/base/base";
import { PRODUCT_TYPE } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository } from "typeorm";
import { CreateGeneralOfferDto } from "./dto/create-general-offer.dto";
import { UpdateGeneralOfferDto } from "./dto/update-general-offer.dto";
import { GeneralOffer } from "./generalOffer.entity";

@Injectable()
export class GeneralOfferService
  extends BaseService<GeneralOffer, CreateGeneralOfferDto, UpdateGeneralOfferDto>
  implements ICrudService<GeneralOffer, CreateGeneralOfferDto, UpdateGeneralOfferDto>
{
  constructor(
    @InjectRepository(GeneralOffer)
    repository: Repository<GeneralOffer>,
    protected readonly apiFeaturesService: APIFeaturesService,
  ) {
    super(repository, apiFeaturesService);
  }

  private async findOffersByProductType(productType: PRODUCT_TYPE) {
    const now = moment();
    const offers = await this.repository
      .createQueryBuilder("offer")
      .where("offer.product = :productType", { productType })
      .andWhere("offer.start_date <= :now AND offer.end_date > :now", {
        now: now.toDate(),
      })
      .getMany();

    return {
      data: offers,
    };
  }

  async findShared() {
    return this.findOffersByProductType(PRODUCT_TYPE.Shared);
  }

  async findDeskArea() {
    return this.findOffersByProductType(PRODUCT_TYPE.Deskarea);
  }

  async findMembership() {
    return this.findOffersByProductType(PRODUCT_TYPE.Membership);
  }

  async findDeals() {
    return this.findOffersByProductType(PRODUCT_TYPE.Deals);
  }

  async findPackages() {
    return this.findOffersByProductType(PRODUCT_TYPE.Packages);
  }

  async findRooms() {
    return this.findOffersByProductType(PRODUCT_TYPE.Room);
  }
}
