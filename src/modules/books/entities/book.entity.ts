import { rmSync } from 'fs';
import { basename } from 'path';
import { Author } from 'src/modules/authors/entities/author.entity';
import {
  BeforeRemove,
  Column,
  Entity,
  Index,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../enums/category.enum';
import { Borrow } from '../../borrow/entities/borrow.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  title: string;

  @Column('enum', { enum: Category, array: true })
  categories: Category[];

  @Column({ default: 0 })
  page: number;

  @Column({ nullable: true, unique: true })
  cover: string;

  @Column({ type: 'date', nullable: true })
  pub_date: string;

  @Column({ default: 0 })
  quantity: number;

  @ManyToOne(() => Author, (author) => author.books, {
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  author: Author;

  @ManyToMany(() => Borrow, (borrow) => borrow.books)
  borrows: Borrow[];

  addQuantity(quantity = 1): void {
    this.quantity = this.quantity + quantity || 1;
    if (this.quantity < 0) {
      throw new Error('the quantity cannot be less than 0');
    }
  }

  @BeforeRemove()
  deleteCover(): void {
    if (this.cover) {
      rmSync('upload/booksCover/' + basename(this.cover), { force: true });
    }
  }
}
