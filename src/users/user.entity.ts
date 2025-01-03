// import {
//   Column,
//   CreateDateColumn,
//   Entity,
//   PrimaryGeneratedColumn,
//   UpdateDateColumn,
// } from "typeorm";

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({
//     type: "varchar",
//     length: 96,
//     nullable: false,
//   })
//   firstName: string;

//   @Column({
//     type: "varchar",
//     length: 96,
//     nullable: true,
//   })
//   lastName: string;

//   @Column({
//     type: "varchar",
//     length: 96,
//     nullable: true,
//   })
//   username: string;

//   @Column({
//     type: "varchar",
//     length: 96,
//     nullable: true,
//   })
//   email: string;

//   @Column({
//     type: "varchar",
//     length: 96,
//     nullable: true,
//   })
//   password?: string;

//   @CreateDateColumn()
//   created_at: Date;

//   @UpdateDateColumn()
//   updated_at: Date;
// }
