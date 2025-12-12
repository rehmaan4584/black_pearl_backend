// src/prisma.service.ts
import { Injectable} from '@nestjs/common'; 
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const connectionString = process.env.DATABASE_URL as string;
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Database connection successfully established.');
    } catch (error) {
      console.error('Failed to connect to the database:', error); 
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Database connection closed.');
  }
}
