import { Module } from '@nestjs/common';

import { operationProviders } from './operation.providers';
import { OperationRepository } from './operation.repository';
import { OperationService } from './operation.service';
import { Operation_DetailsModule } from './operation_details/operation_details.module';
import { Make_Of_ServiceModule } from '../make_of_service/make_of_service.module';

@Module({
  exports: [OperationService, OperationRepository],
  providers: [OperationService, OperationRepository, ...operationProviders],
  imports: [Operation_DetailsModule, Make_Of_ServiceModule],
})
export class OperationModule {}
