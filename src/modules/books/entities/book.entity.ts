import { rmSync } from 'fs';
import { basename } from 'path';
import { Author } from 'src/modules/authors/entities/author.entity';
import {
  BeforeRemove,
  Column,
  Entity,
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

  @ManyToOne(() => Author, (author) => author.books, {
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  author: Author;

  @ManyToMany(() => Borrow, (borrow) => borrow.books)
  borrows: Borrow[];

  @BeforeRemove()
  deleteCover() {
    if (this.cover) {
      rmSync('upload/booksCover/' + basename(this.cover), { force: true });
    }
  }
}
