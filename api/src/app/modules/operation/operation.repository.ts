import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { OPERATION_REPOSITORY } from '@webapi/libs/constants/repositories/repo.constant';
import { OperationEntity } from './entities/operation.entity';
import { Operation_DetailsService } from './operation_details/operation_details.service';
import { Make_Of_ServiceService } from '../make_of_service/make_of_service.service';

@Injectable()
export class OperationRepository {
  constructor(
    @Inject(OPERATION_REPOSITORY)
    private operationRepository: typeof OperationEntity,
    private operation_detailsService: Operation_DetailsService,
    private make_of_serviceService: Make_Of_ServiceService
  ) {}

  async findOne(filter: any, cb: any): Promise<any> {
    return await this.operationRepository
      .findOne<OperationEntity>(filter)
      .then((res) => {
        if (!res) throw new InternalServerErrorException(`Ошибка данных.`);
        // const a = JSON.stringify(res);
        // console.log(a);
        // const b = JSON.parse(a);
        // console.log(JSON.parse(a));

        return cb(res);
      })
      .catch((err) => {
        throw new InternalServerErrorException(
          `Ошибка поиска данных: [${err}].`
        );
      });
  }
}
