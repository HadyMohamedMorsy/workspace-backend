import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { PaymentMethod, TypeOrder } from "src/shared/enum/global-enum";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";

export class CreateOrderDto {
  @IsEnum(TypeOrder, {
    message: "type order must be one of the following: hold or paid",
  })
  type_order: TypeOrder;

  @IsString()
  @IsNotEmpty()
  order_number: string;

  @IsEnum(PaymentMethod)
  @IsOptional()
  payment_method: PaymentMethod;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  total_order: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  order_price: number;

  @IsNumber()
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  customer_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsOptional()
  order_items: OrderItemDto[];

  createdBy: User;

  individual: Individual;
  company: Company;
  studentActivity: StudentActivity;
  user: User;
}

export class OrderItemDto {
  product_id: number;
  @IsNumber()
  @Type(() => Number)
  quantity: number;
}
