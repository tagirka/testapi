import { Module } from '@nestjs/common';

import { paymentProviders } from './payment.providers';
import { PaymentService } from './payment.service';
import { ElsModule } from '../els/els.module';
import { CompanyModule } from '../company/company.module';
import { Make_Of_ServiceModule } from '../make_of_service/make_of_service.module';

@Module({
  exports: [PaymentService],
  providers: [PaymentService, ...paymentProviders],
  imports: [ElsModule, CompanyModule, Make_Of_ServiceModule],
})
export class PaymentModule {}
