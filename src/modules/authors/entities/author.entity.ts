import { Book } from 'src/modules/books/entities/book.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('varchar', { array: true })
  languages: string[];

  @OneToMany(() => Book, (book) => book.author)
  books: Book[];
}
