import { Inject, Injectable } from '@nestjs/common';

import { MEASURE_REPOSITORY } from '../../../libs/constants/repositories/repo.constant';
import { MeasureEntity } from './entities/measure.entity';
import { IApiDBtoDB } from '@webapi/libs/interfaces';

@Injectable()
export class MeasureService {
  constructor(
    @Inject(MEASURE_REPOSITORY)
    private readonly measureRepository: typeof MeasureEntity
  ) {}

  async findOrCreate(title: string, recalc: number): Promise<IApiDBtoDB> {
    return await this.measureRepository
      .findOrCreate({
        where: { title },
        defaults: {
          recalc,
        },
      })
      .then(([row, created]) => ({
        res: created
          ? `Добавлена ед.измерения [${row.title}] id=[${row.id}].`
          : `Найдена ед.измерения [${row.title}] id=[${row.id}].`,
        err: null,
        status: true,
        rows: [row],
      }))
      .catch((row) => {
        return {
          res: null,
          err: `Ошибка записи в таблицу.`,
          status: false,
          rows: [row],
        };
      });
  }
}
