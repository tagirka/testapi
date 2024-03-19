import { Inject, Injectable } from '@nestjs/common';

import { SN_OF_METER_REPOSITORY } from '../../../libs/constants/repositories/repo.constant';
import { SN_Of_MeterEntity } from './entities/sn_of_meter.entity';
import { IApiDBtoDB } from '@webapi/libs/interfaces';

@Injectable()
export class SN_Of_MeterService {
  constructor(
    @Inject(SN_OF_METER_REPOSITORY)
    private readonly sn_of_meterRepository: typeof SN_Of_MeterEntity
  ) {}

  async findOrCreate(sn: string): Promise<IApiDBtoDB> {
    return await this.sn_of_meterRepository
      .findOrCreate({
        where: {
          sn,
        },
      })
      .then(([row, created]) => ({
        res: created
          ? `Добавлен SN [${row.sn}] id=[${row.id}].`
          : `Найден SN [${row.sn}] id=[${row.id}].`,
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

  async findOrBulkCreate(mainRows: any[]): Promise<IApiDBtoDB> {
    const resultFOC = [];

    for (const item of mainRows) {
      const res = await this.sn_of_meterRepository.findOne({
        where: {
          sn: item.device_number,
        },
      });

      if (Object.is(res, null)) {
        resultFOC.push({ sn: item.device_number });
      }
    }

    if (resultFOC.length > 0) {
      return await this.sn_of_meterRepository
        .bulkCreate(resultFOC)
        .then((res) => ({
          res: `Завершена обработка ${res.length} строк.`,
          err: null,
          status: true,
        }))
        .catch(() => ({
          res: null,
          err: `Ошибка записи в таблицу "sn_of_meter".`,
          status: false,
        }));
    } else {
      return {
        res: `Успешное завершение. Новых SN нет`,
        err: null,
        status: true,
      };
    }
  }
}
