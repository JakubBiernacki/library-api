import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  category: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  author: string;
}
