import { Company } from "src/companies/company.entity";
import { GeneralOffer } from "src/general-offer/generalOffer.entity";
import { Individual } from "src/individual/individual.entity";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";

export class CreateAssignGeneralOfferDto {
  createdBy: User;

  generalOffer: GeneralOffer;

  individual?: Individual;

  company?: Company;

  studentActivity?: StudentActivity;
}
