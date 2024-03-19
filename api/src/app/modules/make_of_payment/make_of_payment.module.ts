import { Module } from '@nestjs/common';

import { Make_Of_PaymentService } from './make_of_payment.service';
import { make_of_paymentProviders } from './make_of_payment.providers';

@Module({
  providers: [Make_Of_PaymentService, ...make_of_paymentProviders],
  exports: [Make_Of_PaymentService],
})
export class Make_Of_PaymentModule {}
