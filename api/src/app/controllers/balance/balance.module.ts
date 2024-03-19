import { Module } from '@nestjs/common';

import { ElsModule } from '../../modules/els/els.module';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { Meters_DataModule } from '../../modules/meters_data/meters_data.module';
import { UserModule } from '../auth/user/user.module';
import { AdminModule } from '@webapi/app/admin/admin.module';

@Module({
  providers: [BalanceService],
  exports: [BalanceService],
  controllers: [BalanceController],
  imports: [ElsModule, Meters_DataModule, UserModule, AdminModule],
})
export class BalanceModule {}
