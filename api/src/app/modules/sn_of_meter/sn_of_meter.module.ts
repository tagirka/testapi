import { Module } from '@nestjs/common';

import { SN_Of_MeterService } from './sn_of_meter.service';
import { sn_of_meterProviders } from './sn_of_meter.providers';

@Module({
  providers: [SN_Of_MeterService, ...sn_of_meterProviders],
  exports: [SN_Of_MeterService],
})
export class SN_Of_MeterModule {}
