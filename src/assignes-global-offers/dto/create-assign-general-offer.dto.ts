import { GeneralOffer } from "src/general-offer/generalOffer.entity";
import { User } from "src/users/user.entity";

export class CreateAssignGeneralOfferDto {
  createdBy: User;

  generalOffer: GeneralOffer;
}
