import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { AuthorsModule } from 'src/modules/authors/authors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), AuthorsModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}