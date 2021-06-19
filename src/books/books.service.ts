import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  findAll(): Promise<Book[]> {
    const books = this.bookRepository.find();

    return books;
  }

  findOne(id: number): Promise<Book> {
    return this.bookRepository.findOneOrFail(id);
  }

  async create(createBookDto: CreateBookDto): Promise<void> {
    const newBook = this.bookRepository.create(createBookDto);
    await this.bookRepository.save(newBook);
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return this.bookRepository.update(id, updateBookDto);
  }

  async remove(id: number): Promise<void> {
    await this.bookRepository.delete(id);
  }
}
