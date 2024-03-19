import { Module } from '@nestjs/common';

import { TariffService } from './tariff.service';
import { tariffProviders } from './tariff.providers';

@Module({
  providers: [TariffService, ...tariffProviders],
  exports: [TariffService],
})
export class TariffModule {}
