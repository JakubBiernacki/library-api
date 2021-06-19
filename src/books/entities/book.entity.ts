import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text', { array: true })
  category: string[];

  @Column()
  author: string;

  @Column()
  cover: string;

  @Column({ type: 'date' })
  pub_date: string;
}
