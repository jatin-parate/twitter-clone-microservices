import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { UniqueEmailValidator } from './validators/unique-email.validator';
import { UniqueUsernameValidator } from './validators/unique-username.validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync<any>({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST')!,
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ): MongooseModuleFactoryOptions => ({
        uri: configService.get('DB_URL'),
      }),
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [LocalStrategy, UniqueEmailValidator, UniqueUsernameValidator],
})
export class AppModule {}
