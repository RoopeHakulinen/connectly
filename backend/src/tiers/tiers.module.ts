import { Module } from '@nestjs/common';
import { TiersService } from './tiers.service';
import { TiersController } from './tiers.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [TiersController],
  providers: [TiersService, PrismaService],
})
export class TiersModule {}
