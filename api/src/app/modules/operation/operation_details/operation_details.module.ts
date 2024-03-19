import { Module } from '@nestjs/common';

import { Operation_DetailsController } from './operation_details.controller';
import { operation_detailsProviders } from './operation_details.providers';
import { Operation_DetailsService } from './operation_details.service';
import { TariffModule } from '../../tariff/tariff.module';

@Module({
  controllers: [Operation_DetailsController],
  exports: [Operation_DetailsService],
  providers: [Operation_DetailsService, ...operation_detailsProviders],
  imports: [TariffModule],
})
export class Operation_DetailsModule {}
