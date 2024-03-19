import { Sequelize } from 'sequelize';
import { Inject, Injectable } from '@nestjs/common';
import { ELS_REPOSITORY } from '@webapi/libs/constants';
import { UES_NUM_RANDOM_ELS } from '@webapi/libs/constants/runtime/exception.constant';

import { CompanyEntity } from '../../company/entities/company.entity';
import { Make_Of_ServiceEntity } from '../../make_of_service/entities/make_of_service.entity';
import { OperationEntity } from '../../operation/entities/operation.entity';
import { PaymentEntity } from '../../payment/entities/payment.entity';
import { AswerElsOperationDto } from '../dto/answer-els-operation.dto';
import { ElsEntity } from '../entities/els.entity';
import { NamingEntity } from '../entities/naming.entity';
import {
  IApiDBtoDB,
  ITableOptions,
  TableOptionsEnum,
} from '@webapi/libs/interfaces';

@Injectable()
export class ElsRepository {
  constructor(
    @Inject(ELS_REPOSITORY) private elsRepository: typeof ElsEntity
  ) {}

  async getElsById(id: number): Promise<ElsEntity> {
    const auth = await this.elsRepository.findOne({
      where: { id },
      include: [NamingEntity],
    });
    return auth;
  }

  async getElsByEls(els: string): Promise<AswerElsOperationDto> {
    let rq: AswerElsOperationDto;
    const res = await this.elsRepository.findOne({
      attributes: ['id', 'els'],
      where: { els: els.trim() },
      include: [
        {
          model: OperationEntity,
          attributes: [
            'id',
            'els_id',
            'service_id',
            'company_id',
            'billing_year',
            'billing_month',
            'sum_z',
            'sum_opl',
            'sum_final',
          ],
          include: [
            {
              model: Make_Of_ServiceEntity,
              attributes: ['id', 'code_sus', 'name_us'],
            },
            {
              model: CompanyEntity,
              attributes: [
                'id',
                'code',
                'name',
                'inn',
                'address',
                'priority',
                'guid_so',
                'phone',
              ],
            },
          ],
        },
        {
          model: PaymentEntity,
          attributes: [
            'id',
            'els_id',
            'service_id',
            'company_id',
            'code_so',
            'sum_opl',
            'date_opl',
            'type_opl',
            'billing_year',
            'billing_month',
            'doc_num',
            'pay_num',
          ],
          /* required: false,
          where: {
            service_id: { [Op.col]: "operation_els.service_id" },
            billing_year: { [Op.col]: "operation_els.billing_year" },
            //billing_month: { [Op.col]: "operation_els_id.billing_month" },
          }, */
        },
        {
          model: NamingEntity,
          attributes: [
            'id',
            'short_name',
            'last_name',
            'first_name',
            'patronymic',
            'main_address',
            'fk_auth_id',
          ],
        },
      ],
    });
    return { ...rq, res } as AswerElsOperationDto;
  }

  async findOrCreate(mainRows: any[]): Promise<IApiDBtoDB> {
    let tfNotErr = true;
    const resultFOC = [];

    for (const item of mainRows) {
      resultFOC.push(
        await this.elsRepository
          .findOrCreate({
            where: {
              els: item.longcode,
            },
          })
          .then(([row, created]) => ({
            res: created
              ? `Добавлен ЕЛС [${row.els}] id=[${row.id}].`
              : `Найден ЕЛС [${row.els}] id=[${row.id}].`,
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

  async findOrBulkCreate(mainRows: any[]): Promise<IApiDBtoDB> {
    const resultFOC = [];

    for (const item of mainRows) {
      const res = await this.elsRepository.findOne({
        where: {
          els: item.longcode,
        },
      });

      if (Object.is(res, null)) {
        resultFOC.push({ els: item.longcode });
      }
    }

    if (resultFOC.length > 0) {
      return await this.elsRepository
        .bulkCreate(resultFOC)
        .then((res) => ({
          res: `Завершена обработка ${res.length} строк.`,
          err: null,
          status: true,
        }))
        .catch(() => ({
          res: null,
          err: `Ошибка записи в таблицу "els".`,
          status: false,
        }));
    } else {
      return {
        res: `Успешное завершение. Новых ЕЛС нет`,
        err: null,
        status: true,
      };
    }
  }

  async findElsIdByEls(els: string): Promise<number | null> {
    const row = await this.elsRepository.findOne({
      where: { els: els.trim() },
    });
    if (Object.is(row, null)) {
      return null; //выдать ошибку в лог
    } else {
      return row.id;
    }
  }

  async findOne(filter: { els?: string; id?: number }): Promise<ElsEntity> {
    return await this.elsRepository.findOne<ElsEntity>({
      where: { ...filter },
    });
  }

  async findElsById(id: number): Promise<string | null> {
    const row = await this.elsRepository.findOne<ElsEntity>({
      where: { id },
    });

    return !!row ? row.els : null;
  }

  async tableOptions(tableOptions: string[]): Promise<ITableOptions> {
    const res = (await this.elsRepository.findAll({
      attributes: tableOptions.map((item) => {
        switch (item) {
          case TableOptionsEnum.COUNT:
            return [
              Sequelize.fn('count', Sequelize.col('id')),
              TableOptionsEnum.COUNT,
            ];
          case TableOptionsEnum.MAXID:
            return [
              Sequelize.fn('max', Sequelize.col('id')),
              TableOptionsEnum.MAXID,
            ];
          case TableOptionsEnum.MINID:
            return [
              Sequelize.fn('min', Sequelize.col('id')),
              TableOptionsEnum.MINID,
            ];
          default:
            return null;
        }
      }),
      raw: true,
    })) as unknown as [ITableOptions];

    for (const item in res[0]) {
      switch (item) {
        case TableOptionsEnum.COUNT:
          res[0][item] = +res[0][item];
          break;
        case TableOptionsEnum.MAXID:
          if (Object.is(res[0][TableOptionsEnum.MAXID], null)) {
            res[0][TableOptionsEnum.MAXID] = 0;
          } else {
            res[0][item] = +res[0][item];
          }
          break;
        case TableOptionsEnum.MINID:
          if (Object.is(res[0][TableOptionsEnum.MINID], null)) {
            res[0][TableOptionsEnum.MINID] = 0;
          } else {
            res[0][item] = +res[0][item];
          }
          break;
      }
    }

    return res[0];
  }

  async getRandomEls(
    numEls: number = UES_NUM_RANDOM_ELS
  ): Promise<{ id: number }[]> {
    if (numEls <= 0 || numEls > UES_NUM_RANDOM_ELS) return [];

    const { minID, maxID } = await this.tableOptions([
      TableOptionsEnum.MAXID,
      TableOptionsEnum.MINID,
    ]);
    const max = maxID - minID + 1;

    const elsArray: { id: number }[] = [];

    do {
      const id = minID + Math.floor(Math.random() * max);

      if (!elsArray.find((item) => item.id == id)) {
        const elsItem = await this.findOne({ id });

        if (!!elsItem) {
          elsArray.push({ id });
        }
      }
    } while (elsArray.length < numEls);

    return elsArray;
  }
}
