import { Inject, Injectable } from '@nestjs/common';

import { COMPANY_REPOSITORY } from '../../../libs/constants/repositories/repo.constant';

import { CompanyEntity } from './entities/company.entity';
import { IApiDBtoDB } from '@webapi/libs/interfaces';

@Injectable()
export class CompanyService {
  constructor(
    @Inject(COMPANY_REPOSITORY) private companyRepository: typeof CompanyEntity
  ) {}

  async findOrCreate(mainRows: any[]): Promise<IApiDBtoDB> {
    let tfNotErr = true;
    const resultFOC = [];

    for (const item of mainRows) {
      resultFOC.push(
        await this.companyRepository
          .findOrCreate({
            where: {
              code: item.code,
            },
            defaults: {
              code: item.code,
              name: item.name,
              inn: item.inn,
              address: item.address,
              priority: parseInt(item.priority, 10),
              guid_so: item.guid_so,
              phone: item.phone,
              off_payment: parseInt(item.off_payment, 10),
            },
          })
          .then(([row, created]) => ({
            res: created
              ? `Добавлен код [${row.code}] id=[${row.id}].`
              : `Найден ЕЛС [${row.code}] id=[${row.id}].`,
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

  async findCompanyIdByCode(code: string): Promise<number | null> {
    const row = await this.companyRepository.findOne({
      where: { code: code.trim() },
    });
    if (row === null) {
      return null; //выдать ошибку в лог
    } else {
      return row.id;
    }
  }
}
