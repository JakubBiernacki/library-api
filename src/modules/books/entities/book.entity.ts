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
  copies: number;

  @ManyToOne(() => Author, (author) => author.books, {
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  author: Author;

  @ManyToMany(() => Borrow, (borrow) => borrow.books)
  borrows: Borrow[];

  availableCopiesCount(): number {
    const borrows = this.borrows.filter((borrow) => !borrow.delivery_date);
    return this.copies - borrows.length;
  }

  @BeforeRemove()
  deleteCover(): void {
    if (this.cover) {
      rmSync('upload/booksCover/' + basename(this.cover), { force: true });
    }
  }
}
