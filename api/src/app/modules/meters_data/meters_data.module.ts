import { Module } from '@nestjs/common';

import { meters_dataProviders } from './meters_data.providers';
import { Meters_DataService } from './meters_data.service';
import { ElsModule } from '../els/els.module';

@Module({
  exports: [Meters_DataService],
  providers: [Meters_DataService, ...meters_dataProviders],
  imports: [ElsModule],
})
export class Meters_DataModule {}
