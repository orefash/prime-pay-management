import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtExpirationMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-auth-token'];

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Token not found' });
    }

    // Ensure token is a string
    const tokenString = Array.isArray(token) ? token[0] : token;

    try {
      const decodedToken = this.jwtService.decode(tokenString, { json: true });

      if (decodedToken && typeof decodedToken === 'object' && 'exp' in decodedToken) {
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken['exp'] < currentTime) {
          return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Token has expired' });
        }
      }
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
    }

    next();
  }
}
