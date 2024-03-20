import { Op, Sequelize } from 'sequelize';
import { Inject, Injectable } from '@nestjs/common';

import { addOneMonth } from '@webapi/libs/utils/helpers/date.helper';

import { ACCOUNT_REPOSITORY } from '../../../libs/constants/repositories/repo.constant';
import { AccountEntity } from './entities/account.entity';
import { CompanyEntity } from '../company/entities/company.entity';
import { Make_Of_ServiceEntity } from '../make_of_service/entities/make_of_service.entity';
import { MeasureEntity } from '../measure/entities/measure.entity';
import { OperationEntity } from '../operation/entities/operation.entity';
import { Operation_DetailsEntity } from '../operation/operation_details/entities/operation_details.entity';
import { PaymentEntity } from '../payment/entities/payment.entity';
import { TariffEntity } from '../tariff/entities/tariff.entity';
import { IApiDBtoDB } from '@webapi/libs/interfaces';

@Injectable()
export class AccountService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY)
    private readonly accountRepository: typeof AccountEntity
  ) {}

  async getAccountBalance(
    fk_els_id,
    billing_year,
    billing_month
  ): Promise<any> /* Много где в коде встерил Promis`ы с any, думаю не плохо было бы типизировать, хотя возможно это излишне*/ { 
    return await this.accountRepository.findAll({
      attributes: ['id', 'personal_account'],
      where: { fk_els_id },
      order: [['id', 'ASC']],
      include: [
        {
          model: Make_Of_ServiceEntity,
          attributes: ['fk_company_id', 'code_sus', 'name_us', 'service_type'],
          required: true,
          include: [
            {
              model: CompanyEntity,
              as: 'company_service',
              attributes: ['code', 'name', 'inn', 'address', 'off_payment'],
            },
          ],
        },
        {
          model: OperationEntity,
          as: 'account_operation',
          where: {
            fk_els_id,
            billing_year,
            billing_month,
          },

          attributes: ['sum_z', 'sum_opl', 'sum_final'],
          include: [
            {
              model: Operation_DetailsEntity,
              as: 'details',
              attributes: ['sum_accrual', 'sum_recalc', 'scope_service'],
            },
          ],
        },
      ],
    });
  }

  async getOperationByElsId({
    elsId,
    billingYear,
    billingMonth,
  }: {
    elsId: number;
    billingYear: number;
    billingMonth: number;
  }): Promise<any> {
    const { month: nextMonth, year: nextYear } = addOneMonth({
      month: billingMonth,
      year: billingYear,
    });

    const user = await this.accountRepository.findAll(
      {
        attributes: ['personal_account'],
        where: { fk_els_id: elsId },
        include: [
          {
            model: Make_Of_ServiceEntity,
            attributes: [
              'id',
              'fk_company_id',
              'code_sus',
              'name_us',
              'service_type',
              'decimal_places',
            ],
            include: [
              {
                model: CompanyEntity,
                as: 'company_service',
                attributes: ['code', 'name', 'inn', 'address', 'off_payment'],
              },
            ],
          },
          {
            model: PaymentEntity,
            as: 'account_payment',
            on: {
              col1: Sequelize.where(
                Sequelize.col('account_payment.fk_els_id'),
                { [Op.eq]: elsId }
              ),
              col2: Sequelize.where(
                Sequelize.col('AccountEntity.fk_service_id'),
                { [Op.eq]: Sequelize.col('account_payment.fk_service_id') }
              ),
              //TODO
              // col3: Sequelize.where(Sequelize.col('account_payment.date_opl'), {
              col3: Sequelize.where(Sequelize.col('account_payment.date_opl'), {
                [Op.gt]: new Date(nextYear, nextMonth - 1),
                [Op.lte]: new Date(nextYear, nextMonth),
              }),
              // col3: Sequelize.where(
              //   Sequelize.col('account_payment.billing_year'),
              //   { [Op.eq]: nextYear }
              // ),
              // col4: Sequelize.where(
              //   Sequelize.col('account_payment.billing_month'),
              //   { [Op.eq]: nextMonth }
              // ),
            },
            attributes: ['id', 'sum_opl'],
          },
          {
            model: OperationEntity,
            as: 'account_operation',
            on: {
              col0: Sequelize.where(
                Sequelize.col('account_operation.fk_els_id'),
                { [Op.eq]: elsId }
              ),
              col1: Sequelize.where(Sequelize.col('AccountEntity.id'), {
                [Op.eq]: Sequelize.col('account_operation.fk_account_id'),
              }),
              col2: Sequelize.where(
                Sequelize.col('AccountEntity.fk_service_id'),
                { [Op.eq]: Sequelize.col('account_operation.fk_service_id') }
              ),
              col3: Sequelize.where(
                Sequelize.col('account_operation.billing_year'),
                { [Op.eq]: billingYear }
              ),
              col4: Sequelize.where(
                Sequelize.col('account_operation.billing_month'),
                { [Op.eq]: billingMonth }
              ),
            },

            attributes: ['id', 'fk_els_id', 'sum_z', 'sum_opl', 'sum_final'],
            include: [
              {
                model: MeasureEntity,
                as: 'measure_operation',
                attributes: ['title'],
              },
              {
                model: Operation_DetailsEntity,
                as: 'details',
                attributes: [
                  'id',
                  'sum_accrual',
                  'sum_recalc',
                  'scope_service',
                ],
                include: [
                  {
                    model: TariffEntity,
                    as: 'tariff_details',
                    attributes: ['id', 'title', 'price'],
                  },
                ],
              },
            ],
          },
        ],
      }
      //raw: true,
    );

    return user; // .toJSON();
  }

  async findOrCreate(mainRows: any[]): Promise<IApiDBtoDB> {
    let tfNotErr = true;
    const resultFOC = [];

    for (const item of mainRows) {
      //resultFOC.push(
      /* Немного поменял решение, убрал then
          ощущение что так выглядит более читаемо.
          Встретил решение с async+then почти во всём коде, неочень понимаю зачем их комбинировать
      */  
      try {  
        const [row, created] = await this.accountRepository.findOrCreate({
          where: {
            [Op.and]: [
              { personal_account: item.lsnum },
              { fk_service_id: item['usl_service_id.id'] },
            ],
          },
          defaults: {
            personal_account: item.lsnum,
            fk_service_id: item['usl_service_id.id'],
            fk_els_id: !item['usl_els_id.id'] ? null : item['usl_els_id.id'], 
          },
        });
        resultFOC.push({
          res: created
            ? `Добавлен ЛС [${row.fk_els_id}].[${row.fk_service_id}].` /* Тоже часто встретил в коде тернарные операторы, они немного услажняют чтение кода */
            : `Найден ЛС [${row.fk_els_id}].[${row.fk_service_id}].`,   
          err: null,
          status: true,
        });
      } catch (error) {
        //залогировать ошибку
        {
          tfNotErr = false;
          return {
            res: null,
            err: `Ошибка записи в таблицу.`,
            status: false,
          };
        }
      }
      // await this.accountRepository
      //   .findOrCreate({
      //     where: {
      //       [Op.and]: [
      //         { personal_account: item.lsnum },
      //         { fk_service_id: item['usl_service_id.id'] },
      //       ],
      //     },
      //     defaults: {
      //       personal_account: item.lsnum,
      //       fk_service_id: item['usl_service_id.id'],
      //       fk_els_id: !item['usl_els_id.id'] ? null : item['usl_els_id.id'],
      //     },
      //   })
      //   .then(([row, created]) => ({
      //     res: created
      //       ? `Добавлен ЛС [${row.fk_els_id}].[${row.fk_service_id}].`
      //       : `Найден ЛС [${row.fk_els_id}].[${row.fk_service_id}].`,
      //     err: null,
      //     status: true,
      //   }))
      //   .catch(() => {
      //     tfNotErr = false;
      //     return {
      //       res: null,
      //       err: `Ошибка записи в таблицу.`,
      //       status: false,
      //     };
      //   });
      //);
    }
    return {
      res: tfNotErr ? `Успешное завершение.` : null,
      err: tfNotErr ? null : `Произошла ошибка выполнения заросов.`,
      status: tfNotErr,
      results: resultFOC,
    };
  }
}
