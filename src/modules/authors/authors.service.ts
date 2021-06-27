import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/modules/books/entities/book.entity';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}

  create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const newAuthor = this.authorRepository.create(createAuthorDto);
    return this.authorRepository.save(newAuthor);
  }

  findAll(): Promise<Author[]> {
    return this.authorRepository.find();
  }

  async findOne(id: number): Promise<Author> {
    const author = await this.authorRepository
      .findOneOrFail(id, {
        relations: ['books'],
      })
      .catch(() => {
        throw new NotFoundException();
      });

    return author;
  }

  async findOneOrCreate(authorDto: CreateAuthorDto): Promise<Author> {
    const author = await this.authorRepository.findOne({ ...authorDto });

    if (author) {
      return author;
    }
    const newAuthor = this.authorRepository.create(authorDto);

    return this.authorRepository.save(newAuthor).catch((err) => {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    });
  }

  async findOneAndGetBooks(id: number): Promise<Book[]> {
    const author = await this.authorRepository.findOne(id, {
      relations: ['books'],
    });
    return author.books;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<any> {
    const author = await this.findOne(id);

    return this.authorRepository.update(author, updateAuthorDto);
  }

  remove(id: number): Promise<any> {
    return this.authorRepository.delete(id);
  }
}
