import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';

@Injectable()
export class CreateUploadsFolderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads');
    }
    next();
  }
}
