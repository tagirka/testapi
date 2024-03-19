import { Module } from '@nestjs/common';

import { Make_Of_MeterService } from './make_of_meter.service';
import { make_of_meterProviders } from './make_of_meter.providers';

@Module({
  providers: [Make_Of_MeterService, ...make_of_meterProviders],
  exports: [Make_Of_MeterService],
})
export class Make_Of_MeterModule {}
