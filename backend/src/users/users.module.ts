import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../../prisma.service';
import { AuthController } from '../auth.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [UsersController, AuthController],
  providers: [UsersService, PrismaService],
  imports: [HttpModule, ConfigModule]
})
export class UsersModule {}
