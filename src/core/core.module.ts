import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { DatabaseModule } from 'src/database/database.module';

import { CacheService } from './cache/cache.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({
      isGlobal: true,
    }),
    DatabaseModule,
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: process.env.NODE_ENV === 'development',
        customProps: () => ({
          context: 'HTTP',
        }),
        customLogLevel: (req, res, err) => {
          if (res.statusCode >= 400 || err) {
            return 'error';
          } else if (res.statusCode >= 300 && res.statusCode < 400) {
            return 'silent';
          }
          return 'info';
        },
        serializers: {
          req(req) {
            req.body = req.raw.body;
            return req;
          },
        },
        customErrorMessage: (req, res) => {
          return 'Request errored with status code: ' + res.statusCode;
        },
        transport:
          process.env.NODE_ENV === 'development'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorizeObjects: true,
                  colorize: true,
                },
              }
            : undefined,
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CoreModule {}
