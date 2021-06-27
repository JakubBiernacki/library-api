import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const book = await this.bookRepository.findOne(id, {
      relations: ['author'],
    });
    if (!book) {
      throw new NotFoundException();
    }
    return book;
  }

  async create(createBookDto: CreateBookDto): Promise<void> {
    const author = await this.authorsService.findOne(createBookDto?.author);

    const newBook = this.bookRepository.create({
      ...createBookDto,
      author,
    });
    await this.bookRepository.save(newBook);
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<any> {
    const book = await this.bookRepository.findOne(id);

    if (!book) {
      throw new NotFoundException();
    }

    const author = await this.authorsService.findOne(updateBookDto?.author);

    if (updateBookDto?.author && !author) {
      throw new HttpException(
        `author #${updateBookDto?.author} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.bookRepository.update(book, { ...updateBookDto, author });
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    if (!book) {
      throw new NotFoundException();
    }
    await this.bookRepository.remove(book);
  }
}
