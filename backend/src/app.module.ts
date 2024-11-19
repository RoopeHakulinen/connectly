import { Module } from '@nestjs/common';
import { FriendsModule } from './friends/friends.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from './config/auth.config';
import { commonConfig } from './config/common.config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    FriendsModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.secret'],
      load: [commonConfig, authConfig],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
