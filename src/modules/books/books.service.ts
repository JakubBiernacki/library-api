import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthorsService } from '../authors/authors.service';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { existsSync } from 'fs';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { SearchBookDto } from './dto/search-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly authorsService: AuthorsService,
  ) {}

  async paginateAll(options: IPaginationOptions): Promise<Pagination<Book>> {
    return paginate<Book>(this.bookRepository, options, {
      relations: ['author'],
    });
  }

  searchAndPaginate(
    options: IPaginationOptions,
    search: SearchBookDto,
  ): Promise<Pagination<Book>> {
    const queryBuilder = this.bookRepository.createQueryBuilder('book');

    Object.entries(search).forEach(([key, value]) => {
      if (value instanceof Array) {
        value.forEach((i) => {
          queryBuilder.andWhere(`:i = ANY(${key})`, { i });
        });
      } else {
        queryBuilder.where(`${key} LIKE :value`, {
          value: `%${value}%`,
        });
      }
    });

    queryBuilder.leftJoinAndSelect('book.author', 'author');

    return paginate<Book>(queryBuilder, options);
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
    const newBook = await this.CreateIfNotExist(createBookDto);

    if (createBookDto?.author) {
      newBook.author = await this.authorsService.findOneOrCreate(
        createBookDto?.author,
      );
    }

    return this.bookRepository.save(newBook);
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<any> {
    const book = await this.bookRepository.preload({ id, ...updateBookDto });

    if (updateBookDto?.author) {
      book.author = await this.authorsService.findOneOrCreate(
        updateBookDto?.author,
      );
    }

    return this.bookRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);

    await this.bookRepository.remove(book);
  }

  async CreateIfNotExist(bookDto: CreateBookDto): Promise<Book> {
    const book = await this.bookRepository.findOne({ title: bookDto.title });

    if (book) throw new ConflictException(`book "${book.title}" already exist`);

    return this.bookRepository.create(bookDto);
  }

  getCover(name: string) {
    const path = process.cwd() + '/upload/cover_img/' + name;
    if (existsSync(path)) {
      return path;
    }
    throw new NotFoundException();
  }

  findByTitleOrFail(title: string): Promise<Book> {
    return this.bookRepository
      .findOneOrFail({ title }, { relations: ['borrows'] })
      .catch(() => {
        throw new NotFoundException(`Book with title ${title} not found`);
      });
  }

  async findOneAndGetBorrows(id: number) {
    const book = await this.bookRepository.findOne(id, {
      relations: ['borrows'],
    });

    return book.borrows.filter((borrow) => !borrow.closed());
  }
}
