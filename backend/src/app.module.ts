import { Module } from '@nestjs/common';
import { TargetsModule } from './targets/targets.module';
import { UsersModule } from './users/users.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { PrismaService } from '../prisma.service';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from './config/auth.config';
import { commonConfig } from './config/common.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    TargetsModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.secret'],
      load: [commonConfig, authConfig],
    }),
  ],
  controllers: [DashboardController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    DashboardService,
    PrismaService,
  ],
})
export class AppModule {}
