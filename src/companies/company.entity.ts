import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum CompanyType {
  GENERAL = "General",
  NGOS = "NGOs",
}

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  name: string;

  @Column({ unique: true, length: 11 })
  phone: string;

  @Column({ length: 256 })
  city: string;

  @Column({
    type: "enum",
    enum: CompanyType,
    default: CompanyType.GENERAL,
  })
  company_type: CompanyType;

  @Column({ type: "text", nullable: true })
  address: string;

  @Column({ unique: true })
  whatsApp: string;

  @Column({ unique: true, nullable: true })
  facebook: string;

  @Column({ unique: true, nullable: true })
  website: string;

  @Column({ unique: true, nullable: true })
  instagram: string;

  @Column({ unique: true, nullable: true })
  linkedin: string;

  @Column("json", { nullable: true })
  holders: holder[] | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date;
}

export class holder {
  name: string;
  number: string;
  whatsApp: string;
}
