import { Sequelize } from 'sequelize';
import { Inject, Injectable } from '@nestjs/common';

import { MAKE_OF_PAYMENT_REPOSITORY } from '../../../libs/constants/repositories/repo.constant';
import { Make_Of_PaymentEntity } from './entities/make_of_payment.entity';

@Injectable()
export class Make_Of_PaymentService {
  constructor(
    @Inject(MAKE_OF_PAYMENT_REPOSITORY)
    private readonly make_of_paymentRepository: typeof Make_Of_PaymentEntity
  ) {}
}
