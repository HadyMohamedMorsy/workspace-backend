import { Company } from "src/companies/company.entity";
import { GeneralOffer } from "src/general-offer/generalOffer.entity";
import { Individual } from "src/individual/individual.entity";
import { Deskarea } from "src/reservations/deskarea/deskarea.entity";
import { ReservationRoom } from "src/reservations/rooms/reservation-room.entity";
import { Shared } from "src/reservations/shared/shared.entity";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";

export class CreateAssignGeneralOfferDto {
  createdBy: User;

  generalOffer: GeneralOffer;

  individual?: Individual;

  company?: Company;

  studentActivity?: StudentActivity;

  shared?: Shared;

  deskarea?: Deskarea;

  reservationRooms?: ReservationRoom;
}
