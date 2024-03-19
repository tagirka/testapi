import { Module } from '@nestjs/common';

import { AccountService } from './account.service';
import { accountProviders } from './account.providers';

@Module({
  providers: [AccountService, ...accountProviders],
  exports: [AccountService],
})
export class AccountModule {}
