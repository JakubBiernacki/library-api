import { parse } from 'path';

export const randomFilename = (req, file, cb) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const { name, ext } = parse(file.originalname);

  cb(null, name + uniqueSuffix + ext);
};
