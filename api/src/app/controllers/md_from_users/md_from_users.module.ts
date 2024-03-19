import { Module } from '@nestjs/common';

import { MD_From_UsersController } from './md_from_users.controller';
import { md_from_usersProviders } from './md_from_users.providers';
import { MD_From_UsersService } from './md_from_users.service';
import { ElsModule } from '../../modules/els/els.module';
import { CompanyModule } from '../../modules/company/company.module';
import { MeasureModule } from '../../modules/measure/measure.module';
import { SN_Of_MeterModule } from '../../modules/sn_of_meter/sn_of_meter.module';
import { TariffModule } from '../../modules/tariff/tariff.module';
import { Make_Of_MeterModule } from '../../modules/make_of_meter/make_of_meter.module';
import { Make_Of_ServiceModule } from '../../modules/make_of_service/make_of_service.module';
import { Meters_DataModule } from '@webapi/app/modules/meters_data/meters_data.module';

@Module({
  controllers: [MD_From_UsersController],
  exports: [MD_From_UsersService],
  providers: [MD_From_UsersService, ...md_from_usersProviders],
  imports: [
    ElsModule,
    CompanyModule,
    MeasureModule,
    SN_Of_MeterModule,
    TariffModule,
    Make_Of_MeterModule,
    Make_Of_ServiceModule,
    Meters_DataModule,
  ],
})
export class MD_From_UsersModule {}
