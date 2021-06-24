import { Injectable } from '@nestjs/common';
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

  findOne(id: number): Promise<Author | undefined> {
    return this.authorRepository.findOne({ id });
  }

  async findOneAndGetBooks(id: number): Promise<Book[]> {
    const author = await this.authorRepository.findOne(id, {
      relations: ['books'],
    });
    return author.books;
  }

  update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<any> {
    return this.authorRepository.update(id, updateAuthorDto);
  }

  remove(id: number): Promise<any> {
    return this.authorRepository.delete(id);
  }
}
