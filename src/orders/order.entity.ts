import { Company } from "src/companies/company.entity";
import { Individual } from "src/individual/individual.entity";
import { TypeOrder, TypeUser } from "src/shared/enum/global-enum";
import { StudentActivity } from "src/student-activity/StudentActivity.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  order_number: string;

  @Column({
    type: "enum",
    enum: TypeOrder,
  })
  type_order: TypeOrder;

  @Column({
    type: "enum",
    enum: TypeUser,
  })
  type_user: TypeUser;

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

  @Column({ nullable: true })
  order_price: number;

  @Column({ nullable: true })
  total_order: number;

  @Column("json", { nullable: true })
  order_items: OrderItemDto[] | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}

export class OrderItemDto {
  product: number;
  quantity: number;
}
