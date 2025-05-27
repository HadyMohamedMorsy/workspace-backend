import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductService } from "src/products/products.service";
import { BaseService } from "src/shared/base/base";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { ICrudService } from "src/shared/interface/crud-service.interface";
import { Repository, SelectQueryBuilder } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order } from "./order.entity";

type RelationConfig = {
  relationPath: string;
  alias: string;
  selectFields: string[];
  filterField: string;
};

export class orderItem {
  product_id: number;
  quantity: number;
}

@Injectable()
export class OrdersService
  extends BaseService<Order, CreateOrderDto, UpdateOrderDto>
  implements ICrudService<Order, CreateOrderDto, UpdateOrderDto>
{
  constructor(
    @InjectRepository(Order)
    repository: Repository<Order>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly productService: ProductService,
  ) {
    super(repository, apiFeaturesService);
  }

  private async updateProductsInventory(orderItems: orderItem[]) {
    const updateProducts = await Promise.all(
      orderItems.map(async item => {
        const product = await this.productService.findOne(item.product_id, {
          id: true,
          store: true,
        });
        return {
          id: product.id,
          store: product.store - item.quantity,
        };
      }),
    );

    await Promise.all(updateProducts.map(product => this.productService.update(product)));
  }

  override queryRelationIndex(queryBuilder?: SelectQueryBuilder<any>, filteredRecord?: any) {
    super.queryRelationIndex(queryBuilder, filteredRecord);
    queryBuilder
      .leftJoin("e.individual", "ep")
      .addSelect(["ep.id", "ep.name", "ep.whatsApp"])
      .leftJoin("e.company", "eco")
      .addSelect(["eco.id", "eco.phone", "eco.name"])
      .leftJoin("e.studentActivity", "esa")
      .addSelect(["esa.id", "esa.name", "esa.unviresty"]);

    if (filteredRecord?.search?.value) {
      queryBuilder.andWhere(
        `ep.name LIKE :name OR ec.firstName LIKE :name OR ec.lastName LIKE :name OR eco.name LIKE :name OR esa.name LIKE :name`,
        {
          name: `%${filteredRecord?.search.value}%`,
        },
      );
      queryBuilder.andWhere(`eco.phone LIKE :number OR ep.whatsApp LIKE :number`, {
        number: `%${filteredRecord?.search.value}%`,
      });
    }

    if (filteredRecord?.customFilters?.start_date && filteredRecord?.customFilters?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: filteredRecord?.customFilters?.start_date,
        end_date: filteredRecord?.customFilters?.end_date,
      });
    }
  }

  private async findRelatedEntities(filterData: any, relationConfig: RelationConfig): Promise<any> {
    const queryBuilder = this.apiFeaturesService.setRepository(Order).buildQuery(filterData);

    queryBuilder
      .leftJoin(`e.${relationConfig.relationPath}`, relationConfig.alias)
      .addSelect(relationConfig.selectFields.map(field => `${relationConfig.alias}.${field}`))
      .andWhere(`${relationConfig.alias}.id = :${relationConfig.filterField}`, {
        [relationConfig.filterField]: filterData[relationConfig.filterField],
      });

    this.queryRelationIndex(queryBuilder);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return this.response(filteredRecord, totalRecords);
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = await super.create(createOrderDto);
    if (order && createOrderDto.order_items?.length > 0) {
      await this.updateProductsInventory(createOrderDto.order_items);
    }
    return order;
  }

  async findOrderByUserAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "createdBy",
      alias: "user",
      selectFields: ["id", "firstName", "lastName"],
      filterField: "user_id",
    });
  }

  async findOrderByIndividualAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "individual",
      alias: "individual",
      selectFields: ["id", "name", "whatsApp"],
      filterField: "individual_id",
    });
  }

  async findOrderByComapnyAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "company",
      alias: "company",
      selectFields: ["id", "name", "phone"],
      filterField: "company_id",
    });
  }

  async findOrderByStudentActivityAll(filterData: any) {
    return this.findRelatedEntities(filterData, {
      relationPath: "studentActivity",
      alias: "studentActivity",
      selectFields: ["id", "name", "unviresty"],
      filterField: "studentActivity_id",
    });
  }
}
