import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { DatabaseModule } from '@webapi/app/database/database.module';
import { acquiringProviders } from './acquiring.providers';
import { AcquiringRepository } from './repositories/acquiring.repository';
import { AcquiringCsvService } from './acquiring.csv.service';
import { AcquiringService } from './acquiring.service';
import { AcquiringController } from './acquiring.controller';
import { BasketRepository } from './repositories/basket.repository';
import { OperationModule } from '@webapi/app/modules/operation/operation.module';

@Module({
  providers: [
    AcquiringService,
    AcquiringRepository,
    AcquiringCsvService,
    BasketRepository,
    ...acquiringProviders,
  ],
  exports: [AcquiringService],
  controllers: [AcquiringController],
  imports: [
    DatabaseModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    OperationModule,
  ],
})
export class AcquiringModule {}
