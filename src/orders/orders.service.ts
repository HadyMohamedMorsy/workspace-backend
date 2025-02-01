import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CompanyService } from "src/companies/company.service";
import { IndividualService } from "src/individual/individual.service";
import { Product } from "src/products/product.entity";
import { ProductService } from "src/products/products.service";
import { TypeUser } from "src/shared/enum/global-enum";
import { APIFeaturesService } from "src/shared/filters/filter.service";
import { StudentActivityService } from "src/student-activity/studentActivity.service";
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
    protected readonly companyService: CompanyService,
    protected readonly individualService: IndividualService,
    protected readonly studentActivityService: StudentActivityService,
  ) {}

  // Create a new record
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const totalOrder = createOrderDto.order_items.reduce((total, item) => {
      return total + this.getOrderItemTotalPrice(item, createOrderDto.type_order);
    }, 0);

    const orderPrice = createOrderDto.order_items.reduce((total, item) => {
      return total + this.getOrderItemTotalPrice(item, "PAID");
    }, 0);

    let customer;

    switch (createOrderDto.type_user) {
      case TypeUser.Individual:
        customer = await this.individualService.findOne(createOrderDto.customer_id);
        break;
      case TypeUser.Company:
        customer = await this.companyService.findOne(createOrderDto.customer_id);
        break;
      case TypeUser.StudentActivity:
        customer = await this.studentActivityService.findOne(createOrderDto.customer_id);
        break;
      default:
        throw new Error("Invalid user type");
    }

    const payload = {
      ...createOrderDto,
      total_order: totalOrder,
      order_price: orderPrice,
      [createOrderDto.type_user.toLowerCase()]: customer,
      order_items: createOrderDto.order_items.map(item => {
        return {
          product: item.product.id,
          quantity: item.quantity,
        };
      }),
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
        await this.productService.update(product);
      });
    }
    return orderSaved;
  }

  // Get all records
  async findAll(filterData) {
    const filteredRecord = await this.apiFeaturesService
      .setRepository(Order)
      .getFilteredData(filterData);
    const totalRecords = await this.apiFeaturesService.getTotalDocs();

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

  // Delete a record
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
