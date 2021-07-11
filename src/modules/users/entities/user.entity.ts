import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeRole, UserRole } from '../enums/user-role';
import { Borrow } from '../../borrow/entities/borrow.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Borrow, (borrow) => borrow.client)
  loans: Borrow[];

  //Employee

  @OneToMany(() => Borrow, (borrow) => borrow.employee_borrow)
  borrow: Borrow[];

  @OneToMany(() => Borrow, (borrow) => borrow.employee_delivery)
  delivery: Borrow[];

  isEmployee(): boolean {
    return EmployeeRole.some((role) => role === this.role);
  }

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLocaleLowerCase();
  }
}
