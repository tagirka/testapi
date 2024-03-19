import { Inject, Injectable } from '@nestjs/common';

import { PAYMENT_REPOSITORY } from '../../../libs/constants/repositories/repo.constant';
import { PaymentEntity } from './entities/payment.entity';
import { ElsService } from '../els/els.service';
import { CompanyService } from '../company/company.service';
import { Make_Of_ServiceService } from '../make_of_service/make_of_service.service';

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_REPOSITORY) private paymentRepository: typeof PaymentEntity,
    private elsService: ElsService,
    private companyService: CompanyService,
    private make_of_serviceService: Make_Of_ServiceService
  ) {}
}
