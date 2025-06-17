import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { PaymentMethod, TypeOrder } from "src/shared/enum/global-enum";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  order_number: string;

  @Column({
    type: "enum",
    enum: TypeOrder,
    nullable: true,
  })
  type_order: TypeOrder;

  @ManyToOne(() => Individual, individual => individual.orders, {
    onDelete: "CASCADE",
  })
  individual: Individual;

  @ManyToOne(() => Company, company => company.orders, {
    onDelete: "CASCADE",
  })
  company: Company;

  @ManyToOne(() => StudentActivity, studentActivity => studentActivity.orders, {
    onDelete: "CASCADE",
  })
  studentActivity: StudentActivity;

  @ManyToOne(() => User, users => users.orders, {
    onDelete: "CASCADE",
  })
  employed: User;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  order_price: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  total_order: number;

  @Column({
    nullable: true,
    type: "enum",
    enum: PaymentMethod,
    default: PaymentMethod.Cach,
  })
  payment_method: PaymentMethod;

  @Column("jsonb", { nullable: true })
  order_items: Array<{
    product_id: number;
    quantity: number;
  }> | null;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}

export class OrderItemDto {
  product_id: number;
  quantity: number;
}
