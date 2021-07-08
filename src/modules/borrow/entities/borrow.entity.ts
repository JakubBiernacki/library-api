import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';

@Entity()
export class Borrow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // many-to-one
  @ManyToOne(() => User, (user) => user.loans)
  client: User;

  // many-to-many
  @ManyToMany(() => Book)
  @JoinTable()
  books: Book[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  borrow_date: string;

  // many-to-one
  @ManyToOne(() => User, (user) => user.borrow)
  employee_borrow: User;

  @Column({ type: 'date', nullable: true })
  delivery_date: string;

  // many-to-one
  @ManyToOne(() => User, (user) => user.delivery)
  employee_delivery: User;
}
