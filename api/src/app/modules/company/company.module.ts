import { Module } from '@nestjs/common';

import { companyProviders } from './company.providers';
import { CompanyService } from './company.service';

@Module({
  exports: [CompanyService],
  providers: [CompanyService, ...companyProviders],
})
export class CompanyModule {}
