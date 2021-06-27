import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorsService } from 'src/authors/authors.service';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly authorsService: AuthorsService,
  ) {}

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find({ relations: ['author'] });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository
      .findOneOrFail(id, {
        relations: ['author'],
      })
      .catch(() => {
        throw new NotFoundException();
      });

    return book;
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
    const book = await this.bookRepository.findOneOrFail(id).catch(() => {
      throw new NotFoundException();
    });

    if (updateBookDto?.author) {
      updateBookDto.author = await this.authorsService.findOneOrCreate(
        updateBookDto?.author,
      );
    }

    return this.bookRepository.update(book, { ...updateBookDto });
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);

    await this.bookRepository.remove(book);
  }
}
