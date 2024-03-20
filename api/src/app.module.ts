import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DatabaseModule } from './app/database/database.module';

import { AuthModule } from './app/controllers/auth/auth.module';
import { AcquiringModule } from './app/modules/acquiring/acquiring.module';
import { BalanceModule } from './app/modules/balance/balance.module';
import { Business_PaymentsModule } from './app/controllers/business_payments/business_payments.module';
import { MD_From_BPModule } from './app/modules/md_from_bp/md_from_bp.module';
import { MD_From_UsersModule } from './app/modules/md_from_users/md_from_users.module';
import { Meters_DataModule } from './app/modules/meters_data/meters_data.module';
import { SmsModule } from './app/controllers/service/sms/sms.module';
import { AdminModule } from './app/admin/admin.module';

// const ENV = process.env.NODE_ENV || 'development';

console.log(`${process.env.NODE_ENV.trim()}`);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`envs/.${process.env.NODE_ENV.trim()}.env`],
      // ENV === 'production' ? 'envs/.production.env' : 'envs/.development.env',
    }),

    LoggerModule.forRoot({
      pinoHttp: {
        messageKey: 'message',
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },

        timestamp: () =>
          `,"@timestamp":"${new Date(Date.now()).toISOString()}"`,
      },
    }),
    DatabaseModule,
    AcquiringModule,
    AuthModule,
    BalanceModule,
    Business_PaymentsModule,
    MD_From_BPModule,
    MD_From_UsersModule,
    Meters_DataModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
// use castomize logger middleware /libs/middleware/logger.middleware
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware).forRoutes('*');
//   }
// }
