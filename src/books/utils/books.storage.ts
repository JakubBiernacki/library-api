import { diskStorage } from 'multer';
import { extname, parse } from 'path';

export const coverStorage = {
  storage: diskStorage({
    destination: 'upload/booksCover',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const { name, ext } = parse(file.originalname);

      cb(null, name + uniqueSuffix + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowExt = ['.png', '.jpg', '.gif', '.jpeg'];
    const ext = extname(file.originalname);
    if (!allowExt.includes(ext)) {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  },
};
