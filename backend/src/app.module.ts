import { Module } from '@nestjs/common';
import { FriendsModule } from './friends/friends.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from './config/auth.config';
import { commonConfig } from './config/common.config';

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
  providers: [],
})
export class AppModule {
}
