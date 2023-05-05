import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'fileSize', async: false })
export class FileSize implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [maxSize, options] = args.constraints;
    if (!value) {
      return true;
    }
    const files = Array.isArray(value) ? value : [value];
    return files.every(file => file.size <= maxSize);
  }

  defaultMessage(args: ValidationArguments) {
    const [maxSize, options] = args.constraints;
    return `The file size should not be greater than ${maxSize / 1000} KB`;
  }
}

@ValidatorConstraint({ name: 'fileExtension', async: false })
export class FileExtension implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [allowedExtensions, options] = args.constraints;
    if (!value) {
      return true;
    }
    const files = Array.isArray(value) ? value : [value];
    return files.every(file => {
      const extension = file.originalname.split('.').pop();
      return allowedExtensions.includes(extension);
    });
  }

  defaultMessage(args: ValidationArguments) {
    const [allowedExtensions, options] = args.constraints;
    return `The file should have one of the following extensions: ${allowedExtensions.join(', ')}`;
  }
}
