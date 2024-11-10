import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export type PrismaLogFormat = 'pretty' | 'colorless' | 'minimal';

const PRISMA_LOG_FORMAT: PrismaLogFormat =
  (process.env.PRISMA_LOG_FORMAT as PrismaLogFormat) || 'minimal';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: [
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: PRISMA_LOG_FORMAT,
    });
  }
}
