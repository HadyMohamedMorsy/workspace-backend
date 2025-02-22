export enum Status {
  ACTIVE = "active",
  PENDING = "pending",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum AuthType {
  Bearer,
  None,
}

export enum Resource {
  Individual = "customers-individual",
  StudentActivity = "customers-studentActivity",
  Company = "customers-company",
  GeneralSettings = "settings-general",
  User = "settings-user",
  ExpensesPlace = "settings-expenses-place",
  ExpensesSalaries = "settings-expenses-salaries",
  Rooms = "settings-Room",
  Product = "kitchen-product",
  Category = "kitchen-category",
  Purchases = "kitchen-purchases",
  Returns = "kitchen-returns",
  Order = "kitchen-orders",
  GeneralOffer = "offer-general-offer",
  OfferWorkingSpace = "offer-memeber-ship",
  OfferPackages = "offer-packages",
  Deals = "deals",
  Task = "tasks",
  Deskarea = "deskarea",
  Shared = "shared",
  ReservationRoom = "reservation-room",
  AssignGeneralOffer = "assign-general-offer",
  AssignesMembership = "assign-memeber-ship",
  AssignesPackage = "assign-package-room",
}

export enum CompanyType {
  GENERAL = "General",
  NGOS = "NGOs",
}

export enum TypeOrder {
  HOLD = "HOLD",
  COST = "COST",
  FREE = "FREE",
  PAID = "PAID",
}

export enum TypeUser {
  Individual = "individual",
  Company = "company",
  StudentActivity = "studentActivity",
  User = "employed",
}

export enum TypeSallary {
  Internal = "Internal",
  External = "External",
}

export enum Role {
  TECHNICAL_SUPPORT = "technical-support",
  GENERAL_MANAGER = "general-manager",
  OPERATION_MANAGER = "operation-manager",
  COMMUNITY_OFFICER = "community-officer",
  ACCOUNTANT = "accountant",
  FOUNDER = "founder",
  SALES = "sales",
}

export enum Permission {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  VIEW = "view",
  INDEX = "index",
  UPDATE_PERMISSION = "update-permissions",
}

export enum TimeOfDay {
  AM = "am",
  PM = "pm",
}

export enum TypeMember {
  DeskaArea = "deskarea",
  Shared = "shared",
}

export enum ReservationStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  COMPLETE = "complete",
}
