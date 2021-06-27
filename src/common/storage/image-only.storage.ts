import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const ImageOnly = (req, file, cb) => {
  const allowExt = ['.png', '.jpg', '.gif', '.jpeg'];
  const ext = extname(file.originalname);
  if (!allowExt.includes(ext)) {
    return cb(new BadRequestException('Only image files are allowed!'), false);
  }
  cb(null, true);
};
