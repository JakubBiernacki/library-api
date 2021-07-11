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
  @ManyToMany(() => Book, (book) => book.borrows)
  @JoinTable()
  books: Book[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  borrow_date: Date;

  // many-to-one
  @ManyToOne(() => User, (user) => user.borrow, { nullable: false })
  employee_borrow: User;

  @Column({ type: 'timestamp', nullable: true })
  delivery_date: Date;

  // many-to-one
  @ManyToOne(() => User, (user) => user.delivery)
  employee_delivery: User;

  closed(): boolean {
    return !!this.delivery_date;
  }
}
