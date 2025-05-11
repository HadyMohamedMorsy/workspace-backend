export interface SelectOptions {
  selectOptions(): Record<string, boolean>;
}

export interface RelationOptions {
  getRelationOptions(): Record<string, any>;
}
