import { Module } from '@nestjs/common';

import { ProviderService } from './provider.service';
import { providerProviders } from './provider.providers';

@Module({
  providers: [ProviderService, ...providerProviders],
  exports: [ProviderService],
})
export class ProviderModule {}
