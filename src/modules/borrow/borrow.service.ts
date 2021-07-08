import { Injectable } from '@nestjs/common';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Borrow } from './entities/borrow.entity';

@Injectable()
export class BorrowService {
  constructor(
    @InjectRepository(Borrow)
    private readonly bookRepository: Repository<Borrow>,
  ) {}
  create(createBorrowDto: CreateBorrowDto) {
    return 'This action adds a new borrow';
  }

  findAll() {
    return `This action returns all borrow`;
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
