import { Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { MulterOptions } from '@nestjs/platform-express/multer/interfaces';
import { Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileValidator {
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB

  public fileSize(req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) {
    if (file.size > this.maxFileSize) {
      return callback(new Error('File size too large'), false);
    }
    callback(null, true);
  }

  public validateFileType(req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(new Error('Invalid file type'), false);
    }
    callback(null, true);
  }

  public ensureFileExists(req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) {
    if (!file) {
      return callback(new Error('File not found'), false);
    }
    callback(null, true);
  }
}
