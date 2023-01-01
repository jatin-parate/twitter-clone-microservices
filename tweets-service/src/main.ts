import * as morgan from 'morgan';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: (requestOrigin, callback) => callback(null, requestOrigin),
      credentials: true,
    },
  });
  app.use(morgan('tiny'));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(cookieParser());

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

  if (isLocalEnv) {
    app.useLogger(['log', 'error', 'debug', 'warn', 'verbose']);
  } else {
    app.useLogger(['log', 'error']);
  }

  app.setGlobalPrefix('tweets');
  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  Logger.log(`App started listening on port: ${port}`, 'Main');
}
bootstrap();
