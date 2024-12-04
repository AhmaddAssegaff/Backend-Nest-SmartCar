import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Role, User } from '@prisma/client'; // Sesuaikan dengan model Anda

// Mendeklarasikan tipe untuk JWT payload
interface JwtPayload {
  id: string;
  name: string;
  role: Role; // Gunakan Role enum di sini, bukan string
  password: string;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string | null;
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['access_token'] || req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default_secret_key',
      ) as JwtPayload;
      req.user = decoded; // Menetapkan tipe yang sudah sesuai
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}
