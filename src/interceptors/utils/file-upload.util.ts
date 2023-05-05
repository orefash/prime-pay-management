import { BadRequestException } from '@nestjs/common';

export const validateFiles = (files: Express.Multer.File, fileTypes: Array<string>, fileSizeLimit: number): Array<BadRequestException> => {
  const errors = [];

//   files.forEach((file) => {
    const { mimetype, size } = files;

    if (!fileTypes.includes(mimetype)) {
      errors.push(new BadRequestException(`Invalid file type: ${mimetype}`));
    }

    if (size > fileSizeLimit) {
      errors.push(new BadRequestException(`File size too large: ${size} bytes`));
    }
//   });

  return errors;
};
