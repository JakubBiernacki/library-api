import { rmSync } from 'fs';
import { basename } from 'path';
import { Author } from 'src/authors/entities/author.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BeforeRemove,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('varchar', { array: true })
  category: string[];

  @Column({ nullable: true, unique: true })
  cover: string;

  @Column({ type: 'date', nullable: true })
  pub_date: string;

  @ManyToOne(() => Author, (author) => author.books, { onDelete: 'CASCADE' })
  author: Author;

  @BeforeRemove()
  deleteCover() {
    if (this.cover) {
      rmSync('upload/booksCover/' + basename(this.cover), { force: true });
    }
  }
}
