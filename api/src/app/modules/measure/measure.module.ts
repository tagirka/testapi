import { Module } from '@nestjs/common';

import { MeasureService } from './measure.service';
import { measureProviders } from './measure.providers';

@Module({
  providers: [MeasureService, ...measureProviders],
  exports: [MeasureService],
})
export class MeasureModule {}
