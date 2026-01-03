import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TargetsModule } from './targets/targets.module';
import { TiersModule } from './tiers/tiers.module';
import { UsersModule } from './users/users.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { NotificationsService } from './notifications/notifications.service';
import { PrismaService } from '../prisma.service';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from './config/auth.config';
import { commonConfig } from './config/common.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TargetsModule,
    TiersModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.secret'],
      load: [commonConfig, authConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'dist', 'public'),
      exclude: ['/api/(.*)'],
    }),
  ],
  controllers: [DashboardController, HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    DashboardService,
    NotificationsService,
    PrismaService,
  ],
})
export class AppModule { }
