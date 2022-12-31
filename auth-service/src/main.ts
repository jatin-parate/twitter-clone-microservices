import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import { useContainer, ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
// @ts-ignore
import * as MongoStore from 'connect-mongo';
import { resolve } from 'node:path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: (requestOrigin, callback) => callback(null, requestOrigin),
      credentials: true,
    },
  });
  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
    fallback: true,
  });

  app.useStaticAssets(resolve('public', 'avatars'), { prefix: '/avatars' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          validationErrors.map(({ target, children, constraints, ...err }) => ({
            ...err,
            constraints: Object.keys(constraints as Record<string, string>)
              .map((key) => (constraints as Record<string, string>)[key])
              .join(', '),
          })),
          'Validation Exception',
        );
      },
    }),
  );

  const configService = app.get(ConfigService);
  const isLocalEnv = configService.get('NODE_ENV') === 'local';

  app.use(
    session({
      secret: configService.get('SESSION_SECRET')!,
      resave: false,
      rolling: true,
      saveUninitialized: false,
      cookie: {
        secure: !isLocalEnv,
        httpOnly: false,
        maxAge: 2 * 24 * 60 * 60 * 1000,
      },
      store: MongoStore.create({
        mongoUrl: configService.get('DB_URL')!,
        collectionName: 'sessions',
        autoRemove: 'interval',
        autoRemoveInterval: 2 * 60,
      }),
    }),
  );

  if (isLocalEnv) {
    app.useLogger(['log', 'error', 'debug', 'warn', 'verbose']);
  } else {
    app.useLogger(['log', 'error']);
  }

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  Logger.log(`App started listening on port: ${port}`, 'Main');
}
bootstrap();
