import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  async create(createBorrowDto: CreateBorrowDto, user: User) {
    createBorrowDto.employee = user;
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newBorrow = new Borrow();

      await this.setBorrow(newBorrow, createBorrowDto);

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

  async findOne(id: string) {
    return this.borrowRepository
      .findOneOrFail(id, {
        relations: ['client', 'books', 'employee_borrow'],
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async update(id: string, updateBorrowDto: UpdateBorrowDto) {
    const { employee_borrow } = updateBorrowDto;
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const borrow = await this.findOne(id);
      if (employee_borrow)
        updateBorrowDto.employee = await this.usersService.findByUsernameOrFail(
          employee_borrow,
        );

      await this.setBorrow(borrow, updateBorrowDto);

      const updated = await queryRunner.manager.save(borrow);
      await queryRunner.commitTransaction();
      return updated;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  remove(id: number) {
    return this.borrowRepository.delete(id);
  }

  async close(id: string, user: User) {
    const borrow = await this.findOne(id);

    if (borrow.closed())
      throw new BadRequestException('borrow is already closed');

    return this.borrowRepository.update(id, {
      delivery_date: new Date(),
      employee_delivery: user,
    });
  }

  private async setBorrow(
    borrow: Borrow,
    dto: CreateBorrowDto | UpdateBorrowDto,
  ) {
    if (dto.client) {
      borrow.client = await this.usersService.findByUsernameOrFail(dto.client);
    }

    if (dto.books) {
      borrow.books = await Promise.all(
        dto.books.map((title) => this.booksService.findByTitleOrFail(title)),
      );
      borrow.books.forEach((book) => book.borrowOne());
    }

    if (dto.borrow_date) {
      borrow.borrow_date = new Date(dto.borrow_date);
    }

    if (dto.employee?.isEmployee()) {
      borrow.employee_borrow = dto.employee;
    } else if (dto?.employee)
      throw new BadRequestException(
        `User: ${dto.employee.username} is not a employee`,
      );
  }
}
