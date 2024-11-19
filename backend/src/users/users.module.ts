import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../../prisma.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from '../auth/auth.controller';

@Module({
  controllers: [UsersController, AuthController],
  providers: [UsersService, PrismaService],
  imports: [HttpModule, ConfigModule],
})
export class UsersModule {}
