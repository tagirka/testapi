import { Module } from '@nestjs/common';

import { ElsService } from './els.service';
import { elsProviders } from './els.providers';

import { ElsRepository } from './repositories/els.repository';
import { AccountModule } from '../account/account.module';

@Module({
  providers: [ElsService, ElsRepository, ...elsProviders],
  exports: [ElsService, ElsRepository],
  imports: [AccountModule],
})
export class ElsModule {}
