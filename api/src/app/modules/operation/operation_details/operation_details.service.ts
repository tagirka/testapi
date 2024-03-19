import { Inject, Injectable } from '@nestjs/common';

import { OPERATION_DETAILS_REPOSITORY } from '../../../../libs/constants/repositories/repo.constant';
import { Operation_DetailsEntity } from './entities/operation_details.entity';
import { TariffService } from '../../tariff/tariff.service';

@Injectable()
export class Operation_DetailsService {
  constructor(
    @Inject(OPERATION_DETAILS_REPOSITORY)
    private operation_detailsRepository: typeof Operation_DetailsEntity,
    private tariffService: TariffService
  ) {}
}
