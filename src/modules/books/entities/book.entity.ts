import { rmSync } from 'fs';
import { basename } from 'path';
import { Author } from 'src/modules/authors/entities/author.entity';
import {
  BeforeRemove,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
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

  @ManyToOne(() => Author, (author) => author.books, {
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  author: Author;

  @BeforeRemove()
  deleteCover() {
    if (this.cover) {
      rmSync('upload/booksCover/' + basename(this.cover), { force: true });
    }
  }
}
