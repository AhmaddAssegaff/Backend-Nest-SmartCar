import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { firstValueFrom, from, retry } from 'rxjs';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  PrismaClientKnownRequestError: any;
  async onModuleInit() {
    const maxRetries = 2;
    const retryDelay = 2000;

    try {
      await firstValueFrom(
        from(this.$connect()).pipe(retry({ count: maxRetries, delay: retryDelay })),
      );
      console.log('Connected to the database');
    } catch (error) {
      console.error('Database connection failed after retries:', error);
      process.exit(1);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
