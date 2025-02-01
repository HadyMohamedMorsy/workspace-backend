import { SetMetadata } from "@nestjs/common";

export const CREATED_BY = "created_by";

export const CreatedByRoute = () => SetMetadata(CREATED_BY, true);
