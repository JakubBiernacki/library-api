import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ImageOnly } from 'src/common/storage/image-only.storage';
import { randomFilename } from 'src/common/storage/random-filename.storage';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { UserRole } from '../users/enums/user-role';
import { AllowRoles } from '../auth/decorator/roles.decorator';
import { Public } from '../auth/decorator/public.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { Request } from 'express';

const storage = {
  storage: diskStorage({
    destination: 'upload/cover_img',
    filename: randomFilename,
  }),
  fileFilter: ImageOnly,
};

@AllowRoles(UserRole.ADMIN)
@UseGuards(RolesGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Public()
  @Get()
  findAll(@Query() { page = 1, limit = 10 }: PaginationDto) {
    limit = limit > 100 ? 100 : limit;
    return this.booksService.paginateAll({
      page,
      limit,
      route: '/books',
    });
  }
  @Public()
  @Get('search')
  search(
    @Query() { page = 1, limit = 10 }: PaginationDto,
    @Query() search: SearchBookDto,
    @Req() req: Request,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.booksService.searchAndPaginate(
      {
        page,
        limit,
        route: req.url,
      },
      search,
    );
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.booksService.findOne(id);
  }

  @AllowRoles(UserRole.EMPLOYEE)
  @Get(':id/borrows')
  findOneAndGetBorrows(@Param('id') id: number) {
    return this.booksService.findOneAndGetBorrows(id);
  }

  @AllowRoles(UserRole.EMPLOYEE)
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @AllowRoles(UserRole.EMPLOYEE)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @AllowRoles(UserRole.EMPLOYEE)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.booksService.remove(id);
  }

  @AllowRoles(UserRole.EMPLOYEE)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadCover(@UploadedFile() file: Express.Multer.File) {
    return { ImgPath: '/books/cover_img/' + file.filename };
  }

  @Public()
  @Get('cover_img/:name')
  getCover(@Param('name') coverName: string, @Res() res) {
    return res.sendFile(this.booksService.getCover(coverName));
  }
}
