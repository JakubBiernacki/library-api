import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorsService } from '../authors/authors.service';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { existsSync } from 'fs';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly authorsService: AuthorsService,
  ) {}

  findAll(offset: number, limit: number): Promise<Book[]> {
    return this.bookRepository.find({
      relations: ['author'],
      skip: offset,
      take: limit,
    });
  }

  findOne(id: number): Promise<Book> {
    return this.bookRepository
      .findOneOrFail(id, {
        relations: ['author'],
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const newBook = this.bookRepository.create({
      ...createBookDto,
    });

    if (createBookDto?.author) {
      newBook.author = await this.authorsService.findOneOrCreate(
        createBookDto?.author,
      );
    }

    return this.bookRepository.save(newBook);
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<any> {
    const book = await this.findOne(id);

    if (updateBookDto?.author) {
      updateBookDto.author = await this.authorsService.findOneOrCreate(
        updateBookDto?.author,
      );
    }

    return this.bookRepository.update(book, updateBookDto);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);

    await this.bookRepository.remove(book);
  }

  getCover(name: string) {
    const path = process.cwd() + '/upload/cover_img/' + name;
    if (existsSync(path)) {
      return path;
    }
    throw new NotFoundException();
  }
}
