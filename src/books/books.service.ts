import { Injectable } from '@nestjs/common';
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

  findOne(id: number): Promise<Book> {
    return this.bookRepository.findOneOrFail(id);
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
    const author = await this.authorsService.findOne(updateBookDto?.author);

    return this.bookRepository.update(id, { ...updateBookDto, author });
  }

  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);
    await this.bookRepository.remove(book);
  }
}
