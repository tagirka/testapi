import { Inject, Injectable } from '@nestjs/common';

import { TARIFF_REPOSITORY } from '@webapi/libs/constants/repositories/repo.constant';
import { TariffEntity } from './entities/tariff.entity';
import { IApiDBtoDB } from '@webapi/libs/interfaces';

@Injectable()
export class TariffService {
  constructor(
    @Inject(TARIFF_REPOSITORY)
    private readonly tariffRepository: typeof TariffEntity
  ) {}

  async findOrCreate(
    title: string,
    price: number,
    fk_service_id: number
  ): Promise<IApiDBtoDB> {
    return await this.tariffRepository
      .findOrCreate({
        where: {
          title,
          price,
          fk_service_id,
        },
      })
      .then(([row, created]) => ({
        res: created
          ? `Добавлен тариф [${row.title}].[${row.price}].[${row.fk_service_id}] id=[${row.id}].`
          : `Найден тариф [${row.title}].[${row.price}].[${row.fk_service_id}] id=[${row.id}].`,
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
