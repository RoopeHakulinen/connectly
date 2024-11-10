import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FriendsModule } from './friends/friends.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { oauth2Config } from './config/oauth2.config';

@Module({
  imports: [
    FriendsModule,
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.secret'],
      load: [oauth2Config],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
}
