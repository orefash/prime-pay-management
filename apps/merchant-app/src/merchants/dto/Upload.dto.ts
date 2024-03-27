import { IsNotEmpty, IsString } from 'class-validator';
import { Express } from 'express';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;

    
  }