import { Module } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrow } from './entities/borrow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Borrow])],
  controllers: [BorrowController],
  providers: [BorrowService],
})
export class BorrowModule {}
