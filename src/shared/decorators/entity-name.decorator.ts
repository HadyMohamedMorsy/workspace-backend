import { SetMetadata } from "@nestjs/common";

export const EntityName = (entity: string, idField: string = "id") =>
  SetMetadata("entity", { entity, idField });
