import { Module } from '@nestjs/common';

import { make_of_serviceProviders } from './make_of_service.providers';
import { Make_Of_ServiceService } from './make_of_service.service';

@Module({
  exports: [Make_Of_ServiceService],
  providers: [Make_Of_ServiceService, ...make_of_serviceProviders],
})
export class Make_Of_ServiceModule {}
