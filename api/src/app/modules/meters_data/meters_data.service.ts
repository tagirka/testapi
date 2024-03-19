import { Op } from 'sequelize';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { IPeriod } from '@webapi/libs/interfaces';
import { getPeriod } from '@webapi/libs/utils/helpers/date.helper';
import { dateString } from '@webapi/libs/utils/helpers/date.helper';
import {
  DeviceColorEnum,
  IAccountServicesItem,
  IElsItem,
  IMdAmount,
  IMdDetailsItem,
  IMonthItem,
  IMeters_DataItem,
  Meters_DataUser,
} from '@webapi/libs/contracts';
import { UES_MONTHS_BEFORE_CHECK } from '@webapi/libs/constants/runtime/exception.constant';
import { parseIntOrZero, parseFloatOrZero } from '@webapi/libs/utils';

import { METERS_DATA_REPOSITORY } from '../../../libs/constants/repositories/repo.constant';
import { CompanyEntity } from '../company/entities/company.entity';
import { Make_Of_MeterEntity } from '../make_of_meter/entities/make_of_meter.entity';
import { Make_Of_ServiceEntity } from '../make_of_service/entities/make_of_service.entity';
import { MD_From_UsersEntity } from '@webapi/app/controllers/md_from_users/entities/md_from_users.entity';
import { MeasureEntity } from '../measure/entities/measure.entity';
import { Meters_DataEntity } from './entities/meters_data.entity';
import { SN_Of_MeterEntity } from '../sn_of_meter/entities/sn_of_meter.entity';
//import { UserRepository } from '@webapi/app/controllers/authorization/user/user.repository';
import { ElsRepository } from '@webapi/app/modules/els/repositories/els.repository';

@Injectable()
export class Meters_DataService {
  constructor(
    @Inject(METERS_DATA_REPOSITORY)
    private readonly meters_dataRepository: typeof Meters_DataEntity,
    //private readonly userRepository: UserRepository,
    private readonly elsRepository: ElsRepository
  ) {}

  /* async getMeters_DataByUserId({
    id,
    period,
  }: {
    id: number;
    period: IPeriod;
  }): Promise<any> {
    const userInfo = await this.userRepository.findOneFullInfo({id});

    if (!userInfo) throw new NotFoundException('Неверный userId');

    const { els } = userInfo;

    if (!Array.isArray(els)) throw new NotFoundException('Неверный массив ЕЛС');

    const elsArray: { id: number; els: string; address: string }[] = els.map(
      (item) => {
        const { id, els, build_els } = item;
        const address = !build_els ? '' : build_els.address_string;
        return { id, els, address };
      }
    );

    const metersDataInfo = await this.getElsInfoByArrayElsId({
      elsArray,
      period,
    });

    const res = this.formationJsonMeters_Data({
      metersDataInfo,
    });

    return res; // metersDataInfo;
  } */

  async findAllCheckDate({
    elsId: fk_els_id,
    billing_year,
    billing_month,
  }: {
    elsId: number;
    billing_year: number;
    billing_month: number;
  }): Promise<any> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + UES_MONTHS_BEFORE_CHECK);

    return await this.meters_dataRepository
      .findAll({
        attributes: ['id', 'date_next_check'],
        where: {
          [Op.and]: [
            { fk_els_id },
            { billing_year },
            { billing_month },
            {
              [Op.or]: [
                { date_next_check: { [Op.between]: [startDate, endDate] } },
                { date_next_check: { [Op.lt]: startDate } },
              ],
            },
          ],
        },
        include: [
          {
            model: SN_Of_MeterEntity,
            attributes: ['sn'],
          },
          {
            model: Make_Of_ServiceEntity,
            attributes: ['id'],
            include: [
              {
                model: CompanyEntity,
                as: 'company_service',
                attributes: ['name'],
              },
            ],
          },
        ],
      })
      .then((res) => {
        if (!Array.isArray(res))
          throw new NotFoundException(
            'Отсутствует массив даты проверки счетчиков'
          );

        return res;
      })
      .catch(() => {
        throw new NotFoundException(
          'Ошибка поиска даты проверки счетчиков по Els ID'
        );
      });
  }

  async findOne({ id }: { id: number }): Promise<Meters_DataEntity> {
    return await this.meters_dataRepository
      .findOne({
        where: { id },
      })
      .then((res) => {
        if (!res) throw new NotFoundException('Не найден id в meters_data.');
        return res;
      })
      .catch(() => {
        throw new NotFoundException('Ошибка поиска id в meters_data.');
      });
  }

  async getElsInfoByArrayElsId({
    elsArray,
    period,
  }: {
    elsArray: { id: number; els: string; address: string }[];
    period: IPeriod;
  }): Promise<any> {
    return Promise.all(
      elsArray.map(async (els) => {
        const resBalance = await this.getMeters_Data({
          els,
          ...period,
        });
        return resBalance;
      })
    );
  }

  async getMeters_Data({
    els,
    start,
    end,
  }: {
    els: { id: number; els: string; address: string };
    start: { year: number; month: number };
    end: { year: number; month: number };
  }): Promise<any> {
    /* const res = await this.elsRepository.findOne({ els });

    if (!res) throw new NotFoundException('Неверный ЕЛС'); */

    //DOIT max period=6

    const period = getPeriod(start, end) > 6 ? 6 : getPeriod(start, end);

    const months = await Promise.all(
      [...new Array(period)].map(async (_, index) => {
        const currentYear = end.month - index < 1 ? end.year - 1 : end.year;
        const currentMonth =
          end.month - index < 1 ? 12 + end.month - index : end.month - index;

        const els_account = await this.getMeters_DataByElsId({
          elsId: els.id,
          billing_year: currentYear,
          billing_month: currentMonth,
        });

        if (!els_account)
          throw new NotFoundException(
            'Ошибка поиска показаний счетчиков по Els ID'
          );

        return {
          billing_year: currentYear,
          billing_month: currentMonth,
          els_account,
        };
      })
    );

    return {
      ...els,
      months,
    };
  }

  async getMeters_DataByElsId({
    elsId: fk_els_id,
    billing_year,
    billing_month,
  }: {
    elsId: number;
    billing_year: number;
    billing_month: number;
  }): Promise<any> {
    return await this.meters_dataRepository
      .findAll({
        attributes: [
          'id',
          'fk_service_id',
          'date_previous_period',
          'volume_previous_period',
          'volume_pre_previous_period',
          'date_current_period',
          'individual_volume_in_house',
          'date_next_check',
          'scoreboard_meter',
          'additional_parameter_code1',
          'additional_parameter1',
          'additional_parameter2',
        ],
        where: { [Op.and]: { fk_els_id, billing_year, billing_month } },
        include: [
          {
            model: Make_Of_MeterEntity,
            attributes: ['type'],
          },
          {
            model: SN_Of_MeterEntity,
            attributes: ['sn'],
          },
          {
            model: MeasureEntity,
            attributes: ['title'],
          },
          {
            model: MD_From_UsersEntity,
            attributes: ['volume', 'date_entering'],
            order: [['date_entering', 'DESC']],
            limit: 1,
          },
          {
            model: Make_Of_ServiceEntity,
            attributes: ['id', 'code_sus', 'name_us', 'decimal_places'],
            include: [
              {
                model: CompanyEntity,
                as: 'company_service',
                attributes: [
                  'id',
                  'code',
                  'name',
                  'inn',
                  'address',
                  'off_payment',
                ],
              },
            ],
          },
        ],
      })
      .then((res) => res)
      .catch(() => null);
  }

  formationJsonMeters_Data({
    metersDataInfo,
  }: {
    metersDataInfo: any;
  }): Meters_DataUser.Response {
    const els = this.formationIElsItems(metersDataInfo);
    return { els };
  }

  private formationIElsItems(metersDataInfo: any[]): IElsItem[] {
    return Array.isArray(metersDataInfo)
      ? metersDataInfo.map((oneEls) => {
          const { id, els, address } = oneEls;
          const months = Array.isArray(oneEls.months)
            ? this.formationIMonthItems(oneEls.months)
            : [];

          return { id, els, address, months };
        })
      : [];
  }

  private formationIMonthItems(monthItems: any[]): IMonthItem[] {
    const months = Array.isArray(monthItems)
      ? monthItems.map((oneMonth) => {
          const { billing_year, billing_month } = oneMonth;
          const account_services = this.formationIAccountServicesItems(
            oneMonth.els_account
          );

          return { billing_year, billing_month, account_services };
        })
      : [];

    return months;
  }

  private formationIAccountServicesItems(
    accountItems: any[]
  ): IAccountServicesItem[] {
    if (!Array.isArray(accountItems) || !accountItems.length) return [];
    const accountsTransform = [];
    const details = [];
    let serviceIdNow = 0;

    accountItems
      .sort((itemA, itemB) => {
        const {
          fk_service_id: aServiceId,
          additional_parameter_code1: aAddCode,
        } = itemA;
        const {
          fk_service_id: bServiceId,
          additional_parameter_code1: bAddCode,
        } = itemB;

        const aCompareStr = `${aServiceId}-${aAddCode.trim()}`;
        const bCompareStr = `${bServiceId}-${bAddCode.trim()}`;

        return aCompareStr.localeCompare(bCompareStr);
      })
      .forEach((current, index) => {
        const {
          fk_service_id: serviceId,
          additional_parameter_code1: addCode,
        } = current;

        if (!addCode.trim()) {
          if (details.length > 0) {
            accountsTransform.push([...details]);
            details.splice(0);
            serviceIdNow = 0;
          }
          accountsTransform.push([current]);
        } else {
          serviceIdNow = !serviceIdNow ? serviceId : serviceIdNow;

          if (serviceIdNow !== serviceId) {
            accountsTransform.push([...details]);
            details.splice(0);
            serviceIdNow = serviceId;
          }

          details.push(current);

          if (index >= accountItems.length - 1) {
            accountsTransform.push([...details]);
          }
        }
      });

    const accounts: IAccountServicesItem[] = accountsTransform.map(
      (detailsItems) => {
        const {
          date_previous_period,
          //date_current_period,
          date_next_check,
          scoreboard_meter: vol_max_length,
          additional_parameter2: accomodation,
          type_meter,
          sn_meters,
          meters_data_md_users: metersDataMdUsers,
        } = detailsItems[0];

        const counterType = !type_meter ? null : type_meter.type;
        const counterNumber = !sn_meters ? null : sn_meters.sn;
        const {
          id,
          name_us: name,
          decimal_places,
          company_service,
        } = detailsItems[0].service_meter;

        const enteredCheckDate = !date_previous_period
          ? null
          : dateString(new Date(date_previous_period), {});

        /*  const currentCheckDate = !date_current_period
          ? null
          : dateString(new Date(date_current_period), {}); */

        const currentCheckDate = !Array.isArray(metersDataMdUsers)
          ? null
          : !metersDataMdUsers.length
          ? null
          : dateString(new Date(metersDataMdUsers[0].date_entering), {});

        const nextCheckDate = !date_next_check
          ? null
          : dateString(new Date(date_next_check), {});

        let isDeviceColor: DeviceColorEnum;

        if (!date_next_check) isDeviceColor = DeviceColorEnum.CHECK_CONTINUES;
        else {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + UES_MONTHS_BEFORE_CHECK);
          const checkDate = new Date(date_next_check);

          if (checkDate < startDate)
            isDeviceColor = DeviceColorEnum.CHECK_EXPIRED;
          else if (checkDate >= startDate && checkDate <= endDate)
            isDeviceColor = DeviceColorEnum.CHECK_COMPLETES;
          else isDeviceColor = DeviceColorEnum.CHECK_CONTINUES;
        }

        const details = this.formationIDetailsItems(detailsItems);

        const meters_data: IMeters_DataItem = {
          counterType,
          counterNumber,
          nextCheckDate,
          isDeviceColor,
          vol_max_length,
          enteredCheckDate,
          currentCheckDate,
          accomodation,
          details,
        };

        return {
          id,
          name,
          decimal_places,
          company_service,
          meters_data,
        };
      }
    );

    return accounts;
  }

  private formationIDetailsItems(detailsItems: any[]): IMdDetailsItem[] {
    const details = Array.isArray(detailsItems)
      ? detailsItems
          .sort((itemA, itemB) => {
            const { additional_parameter_code1: aCode } = itemA;
            const { additional_parameter_code1: bCode } = itemB;

            return aCode.localeCompare(bCode);
          })
          .map((oneDetail) => {
            const {
              id,
              volume_previous_period: startPeriodIndications,
              volume_pre_previous_period,
              individual_volume_in_house,
              additional_parameter1: desc,
              //additional_parameter2: accomodation,
              measure_meter,
              meters_data_md_users: metersDataMdUsers,
            } = oneDetail;

            const enteredIndication = !Array.isArray(metersDataMdUsers)
              ? null
              : !metersDataMdUsers.length
              ? null
              : metersDataMdUsers[0].volume;
            const quantity =
              startPeriodIndications - volume_pre_previous_period;
            const unit = !measure_meter ? null : measure_meter.title;
            const amount: IMdAmount = { quantity, unit };

            return {
              id: parseIntOrZero(id),
              startPeriodIndications,
              enteredIndication,
              individual_volume: parseFloatOrZero(individual_volume_in_house),
              desc,
              //accomodation
              amount,
            };
          })
      : [];

    return details;
  }
}
