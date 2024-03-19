import { Inject, Injectable } from '@nestjs/common';

import { MAKE_OF_SERVICE_REPOSITORY } from '../../../libs/constants/repositories/repo.constant';

import { Make_Of_ServiceEntity } from './entities/make_of_service.entity';
import { IApiDBtoDB } from '@webapi/libs/interfaces';

@Injectable()
export class Make_Of_ServiceService {
  constructor(
    @Inject(MAKE_OF_SERVICE_REPOSITORY)
    private make_of_serviceRepository: typeof Make_Of_ServiceEntity
  ) {}

  async getServiceById(id: number): Promise<Make_Of_ServiceEntity> {
    const service = await this.make_of_serviceRepository.findOne({
      where: { id },
    });
    return service;
  }

  async findAndUpdate(mainRows: any[]): Promise<IApiDBtoDB> {
    let tfNotErr = true;
    const resultFOC = [];

    for (const item of mainRows) {
      resultFOC.push(
        await this.make_of_serviceRepository
          .update(
            { fk_company_id: item.company_id },
            {
              where: {
                id: item.service_id,
              },
            }
          )
          .then(([row]) => ({
            res: `Обновлен сервис [${row}].`,
            err: null,
            status: true,
          }))
          .catch(() => {
            tfNotErr = false;
            return {
              res: null,
              err: `Ошибка записи в таблицу.`,
              status: false,
            };
          })
      );
    }
    return {
      res: tfNotErr ? `Успешное завершение.` : null,
      err: tfNotErr ? null : `Произошла ошибка выполнения запросов.`,
      status: tfNotErr,
      results: resultFOC,
    };
  }

  async findOrCreate(mainRows: any[]): Promise<IApiDBtoDB> {
    let tfNotErr = true;
    const resultFOC = [];

    for (const item of mainRows) {
      resultFOC.push(
        await this.make_of_serviceRepository
          .findOrCreate({
            where: {
              code_sus: item.code_sus,
            },
            defaults: {
              code_sus: item.code_sus,
              name_us: item.name_us,
            },
          })
          .then(([row, created]) => ({
            res: created
              ? `Добавлен код [${row.code_sus}] id=[${row.id}].`
              : `Найден ЕЛС [${row.code_sus}] id=[${row.id}].`,
            err: null,
            status: true,
          }))
          .catch(() => {
            tfNotErr = false;
            return {
              res: null,
              err: `Ошибка записи в таблицу.`,
              status: false,
            };
          })
      );
    }
    return {
      res: tfNotErr ? `Успешное завершение.` : null,
      err: tfNotErr ? null : `Произошла ошибка выполнения заросов.`,
      status: tfNotErr,
      results: resultFOC,
    };
  }

  async findServiceIdByCode(code: string): Promise<number | null> {
    const row = await this.make_of_serviceRepository.findOne({
      where: { code_sus: code.trim() },
    });
    if (Object.is(row, null)) {
      return null; //выдать ошибку в лог
    } else {
      return row.id;
    }
  }

  async findServiceCodeByID(id: number): Promise<string | null> {
    const row = await this.make_of_serviceRepository.findOne({
      where: { id },
    });
    if (Object.is(row, null)) {
      return null; //выдать ошибку в лог
    } else {
      return row.code_sus;
    }
  }
}
