import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { Product } from "src/products/product.entity";
import { ProductService } from "src/products/products.service";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { In, Repository } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order } from "./order.entity";

export class orderItem {
  product: Product;
  quantity: number;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    protected readonly apiFeaturesService: APIFeaturesService,
    protected readonly productService: ProductService,
  ) {}

  // Create a new record
  async create(
    createOrderDto: CreateOrderDto,
    reqBody: {
      customer: Individual | Company | StudentActivity;
      createdBy: User;
    },
  ): Promise<Order> {
    const totalOrder = createOrderDto.order_items.reduce((total, item) => {
      return total + this.getOrderItemTotalPrice(item, createOrderDto.type_order);
    }, 0);

    const orderPrice = createOrderDto.order_items.reduce((total, item) => {
      return total + this.getOrderItemTotalPrice(item, "PAID");
    }, 0);

    const payload = {
      ...createOrderDto,
      total_order: totalOrder,
      order_price: orderPrice,
      createdBy: reqBody.createdBy,
      [createOrderDto.type_user]: reqBody.customer,
      order_items:
        createOrderDto.order_items?.map(item => ({
          product_id: item.product?.id,
          quantity: item.quantity,
        })) || [],
    };

    const order = this.orderRepository.create(payload);
    const orderSaved = await this.orderRepository.save(order);

    if (orderSaved) {
      const updateProducts = createOrderDto.order_items.map(item => {
        const { quantity, product } = item;
        const { store, ...otherItem } = product;
        return {
          store: store - quantity,
          ...otherItem,
        };
      });
      updateProducts.forEach(async product => {
        await this.productService.updateStore(product);
      });
    }
    return orderSaved;
  }

  // Get all records
  async findAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Order).buildQuery(filterData);

    queryBuilder
      .leftJoin("e.individual", "ep")
      .addSelect(["ep.id", "ep.name", "ep.whatsApp"])
      .leftJoin("e.company", "ec")
      .addSelect(["ec.id", "ec.phone", "ec.name"])
      .leftJoin("e.studentActivity", "es")
      .addSelect(["es.id", "es.name", "es.unviresty"])
      .leftJoin("e.createdBy", "ecr")
      .addSelect(["ecr.id", "ecr.firstName", "ecr.lastName"]);

    if (filterData.search.value) {
      queryBuilder.andWhere(
        `ep.name LIKE :name OR ec.name LIKE :name OR es.name LIKE :name OR ecr.firstName LIKE :name`,
        {
          name: `%${filterData.search.value}%`,
        },
      );
      queryBuilder.andWhere(`ec.whatsApp LIKE :number OR ep.whatsApp LIKE :number`, {
        number: `%${filterData.search.value}%`,
      });
    }

    if (filterData?.customFilters?.start_date && filterData?.customFilters?.end_date) {
      queryBuilder.andWhere("e.created_at BETWEEN :start_date AND :end_date", {
        start_date: filterData.customFilters.start_date,
        end_date: filterData.customFilters.end_date,
      });
    }

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  async findOrderByUserAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Order).buildQuery(filterData);
    queryBuilder
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"])
      .andWhere("ec.id = :user_id", { user_id: filterData.user_id });

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }
  async findOrderByIndividualAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Order).buildQuery(filterData);
    queryBuilder
      .leftJoinAndSelect("e.individual", "ei")
      .andWhere("ei.id = :individual_id", { individual_id: filterData.individual_id })
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"]);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }
  async findOrderByComapnyAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Order).buildQuery(filterData);
    queryBuilder
      .leftJoinAndSelect("e.company", "ec")
      .andWhere("ec.id = :company_id", { company_id: filterData.company_id })
      .leftJoin("e.createdBy", "ecr")
      .addSelect(["ecr.id", "ecr.firstName", "ecr.lastName"]);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }
  async findOrderByStudentActivityAll(filterData) {
    const queryBuilder = this.apiFeaturesService.setRepository(Order).buildQuery(filterData);
    queryBuilder
      .leftJoinAndSelect("e.studentActivity", "es")
      .andWhere("es.id = :studentActivity_id", {
        studentActivity_id: filterData.studentActivity_id,
      })
      .leftJoin("e.createdBy", "ec")
      .addSelect(["ec.id", "ec.firstName", "ec.lastName"]);

    const filteredRecord = await queryBuilder.getMany();
    const totalRecords = await queryBuilder.getCount();

    return {
      data: filteredRecord,
      recordsFiltered: filteredRecord.length,
      totalRecords: +totalRecords,
    };
  }

  // Get record by ID
  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`order is not found`);
    }
    return order;
  }

  async findMany(ids: number[]): Promise<Order[]> {
    const orders = await this.orderRepository.find({
      where: {
        id: In(ids),
      },
    });
    if (!orders) {
      throw new NotFoundException(`orders is  not found`);
    }
    return orders;
  }

  // Update a record
  async update(updateOrderDto: UpdateOrderDto) {
    await this.orderRepository.update(updateOrderDto.id, updateOrderDto);
    return this.orderRepository.findOne({ where: { id: updateOrderDto.id } });
  }

  async remove(orderId: number) {
    await this.orderRepository.delete(orderId);
  }

  getOrderItemTotalPrice(item: any, key: string): number {
    let quantity = 0;
    let accesKey = "";

    switch (key) {
      case "PAID":
      case "HOLD":
        quantity = item.quantity;
        accesKey = "selling_price";
        break;
      case "COST":
        quantity = item.quantity;
        accesKey = "purshase_price";
        break;
      case "FREE":
        quantity = 0;
        accesKey = "selling_price";
        break;
      default:
        quantity = item.quantity;
        accesKey = "selling_price";
        break;
    }
    return item.product[accesKey] * quantity;
  }
}
