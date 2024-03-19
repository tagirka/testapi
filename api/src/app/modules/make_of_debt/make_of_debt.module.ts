import { Module } from '@nestjs/common';

import { Make_Of_DebtService } from './make_of_debt.service';
import { make_of_debtProviders } from './make_of_debt.providers';

@Module({
  providers: [Make_Of_DebtService, ...make_of_debtProviders],
  exports: [Make_Of_DebtService],
})
export class Make_Of_DebtModule {}
