import { Module } from '@nestjs/common';

import { ElsModule } from '../els/els.module';
import { BalanceService } from './balance.service';
import { BalanceController } from '../../controllers/balance/balance.controller';
import { Meters_DataModule } from '../meters_data/meters_data.module';
import { UserModule } from '../auth/user/user.module';
import { AdminModule } from '@webapi/app/admin/admin.module';

@Module({
  providers: [BalanceService],
  exports: [BalanceService],
  controllers: [BalanceController],
  imports: [ElsModule, Meters_DataModule, UserModule, AdminModule],
})
export class BalanceModule {}
