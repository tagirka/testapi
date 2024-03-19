import { Inject, Injectable } from '@nestjs/common';

import { MAKE_OF_METER_REPOSITORY } from '../../../libs/constants/repositories/repo.constant';
import { Make_Of_MeterEntity } from './entities/make_of_meter.entity';
import { IApiDBtoDB } from '@webapi/libs/interfaces';

@Injectable()
export class Make_Of_MeterService {
  constructor(
    @Inject(MAKE_OF_METER_REPOSITORY)
    private readonly make_of_meterRepository: typeof Make_Of_MeterEntity
  ) {}

  async findOrCreate(type: string): Promise<IApiDBtoDB> {
    return await this.make_of_meterRepository
      .findOrCreate({
        where: {
          type,
        },
      })
      .then(([row, created]) => ({
        res: created
          ? `Добавлен новый тип счетчика [${row.type}] id=[${row.id}].`
          : `Найден тип счетчика [${row.type}] id=[${row.id}].`,
        err: null,
        status: true,
        rows: [row],
      }))
      .catch((row) => ({
        res: null,
        err: `Ошибка записи в таблицу.`,
        status: false,
        rows: [row],
      }));
  }
}
