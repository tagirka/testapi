import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { MD_From_BPController } from '../../controllers/md_from_bp/md_from_bp.controller';
import { md_from_bpProviders } from './md_from_bp.providers';
import { MD_From_BPService } from './md_from_bp.service';
import { ElsModule } from '../els/els.module';
import { CompanyModule } from '../company/company.module';
import { MeasureModule } from '../measure/measure.module';
import { SN_Of_MeterModule } from '../sn_of_meter/sn_of_meter.module';
import { TariffModule } from '../tariff/tariff.module';
import { Make_Of_MeterModule } from '../make_of_meter/make_of_meter.module';
import { Make_Of_ServiceModule } from '../make_of_service/make_of_service.module';

@Module({
  controllers: [MD_From_BPController],
  exports: [MD_From_BPService],
  providers: [MD_From_BPService, ...md_from_bpProviders],
  imports: [
    ElsModule,
    CompanyModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    MeasureModule,
    SN_Of_MeterModule,
    TariffModule,
    Make_Of_MeterModule,
    Make_Of_ServiceModule,
  ],
})
export class MD_From_BPModule {}
