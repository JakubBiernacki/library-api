import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/book.entity';
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

  async findOne(id: number): Promise<Author | undefined> {
    const author = await this.authorRepository.findOne(id, {
      relations: ['books'],
    });
    if (!author) {
      throw new NotFoundException();
    }
    return author;
  }

  async findOneAndGetBooks(id: number): Promise<Book[]> {
    const author = await this.authorRepository.findOne(id, {
      relations: ['books'],
    });
    return author.books;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<any> {
    const author = await this.authorRepository.findOne(id);
    if (!author) {
      throw new NotFoundException();
    }
    return this.authorRepository.update(author, updateAuthorDto);
  }

  remove(id: number): Promise<any> {
    return this.authorRepository.delete(id);
  }
}
