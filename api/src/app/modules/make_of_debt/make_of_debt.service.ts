import { Sequelize } from 'sequelize';
import { Inject, Injectable } from '@nestjs/common';

import { MAKE_OF_DEBT_REPOSITORY } from '../../../libs/constants/repositories/repo.constant';
import { Make_Of_DebtEntity } from './entities/make_of_debt.entity';

@Injectable()
export class Make_Of_DebtService {
  constructor(
    @Inject(MAKE_OF_DEBT_REPOSITORY)
    private readonly make_of_debtRepository: typeof Make_Of_DebtEntity
  ) {}
}
