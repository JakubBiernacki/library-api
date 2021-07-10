import { Injectable } from '@nestjs/common';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Borrow } from './entities/borrow.entity';
import { UsersService } from '../users/users.service';
import { BooksService } from '../books/books.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BorrowService {
  constructor(
    @InjectRepository(Borrow)
    private readonly borrowRepository: Repository<Borrow>,
    private readonly usersService: UsersService,
    private readonly booksService: BooksService,
    private readonly connection: Connection,
  ) {}
  async create(createBorrowDto: CreateBorrowDto, employee: User) {
    const { client, books, borrow_date } = createBorrowDto;
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newBorrow = new Borrow();

      newBorrow.client = await this.usersService.findByUsernameOrFail(client);

      newBorrow.books = await Promise.all(
        books.map((title) => this.booksService.findByTitleOrFail(title)),
      );
      newBorrow.books.forEach((book) => book.addCopies(-1));

      newBorrow.borrow_date = borrow_date;
      newBorrow.employee_borrow = employee;

      await queryRunner.manager.save(newBorrow.books);
      await queryRunner.manager.save(newBorrow);

      await queryRunner.commitTransaction();
      return newBorrow;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.borrowRepository.find({
      relations: ['client', 'books', 'employee_borrow'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} borrow`;
  }

  update(id: number, updateBorrowDto: UpdateBorrowDto) {
    return `This action updates a #${id} borrow`;
  }

  remove(id: number) {
    return `This action removes a #${id} borrow`;
  }
}
