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
import { BadRequestException } from '@nestjs/common';

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

  addCopies(quantity = 1): void {
    this.copies += quantity;
    if (this.copies < 0) {
      throw new BadRequestException(
        `not so many copies (${-quantity}) of the book '${
          this.title
        }' available`,
      );
    }
  }

  @BeforeRemove()
  deleteCover(): void {
    if (this.cover) {
      rmSync('upload/booksCover/' + basename(this.cover), { force: true });
    }
  }
}
