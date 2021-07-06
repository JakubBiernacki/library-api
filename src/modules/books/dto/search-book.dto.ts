import { OmitType } from '@nestjs/mapped-types';

import { UpdateBookDto } from './update-book.dto';

export class SearchBookDto extends OmitType(UpdateBookDto, [
  'cover',
  'page',
  'pub_date',
] as const) {}
