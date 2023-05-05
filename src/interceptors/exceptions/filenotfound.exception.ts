import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { MulterError } from 'multer';

@Catch(MulterError, Error)
export class FileUploadExceptionFilter implements ExceptionFilter {
  catch(error: MulterError | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (error instanceof MulterError) {
      switch (error.code) {
        case 'LIMIT_FILE_SIZE':
          return response.status(400).json({
            statusCode: 400,
            message: 'File size must not exceed 3MB',
            error: 'Bad Request',
          });
        default:
          return response.status(400).json({
            statusCode: 400,
            message: 'Unexpected field',
            error: 'Bad Request',
          });
      }
    } else {
        console.log('error: ', error)
      return response.status(500).json({
        statusCode: 500,
        message: error.message,
        error: error.message,
      });
    }
  }
}
