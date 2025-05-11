export interface ICrudService<T, CreateDto, UpdateDto> {
  findAll(filterData: any): Promise<{ data: T[]; recordsFiltered: number; totalRecords: number }>;
  findOne(id: number): Promise<T>;
  create(createDto: CreateDto): Promise<T>;
  update(updateDto: UpdateDto): Promise<T>;
  delete(id: number): Promise<{ deleted: boolean; id: number }>;
}
