import { BaseMemberEntity } from "src/shared/entities/base.entity";
import { Module } from "src/shared/enum/global-enum";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("lookups")
export class Lookup extends BaseMemberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true })
  name: string;

  @Column({ type: "boolean", default: false })
  is_parent: boolean;

  @Column({ type: "enum", enum: Module, nullable: true })
  module: Module;

  @ManyToOne(() => Lookup, lookup => lookup.children, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "parent_id" })
  parent: Lookup;

  @OneToMany(() => Lookup, lookup => lookup.parent)
  children: Lookup[];

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy: User;
}
