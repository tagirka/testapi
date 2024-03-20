import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import {
  BalanceUser,
  IAmount,
  IElsItem,
  IMonthItem,
  IAccountServicesItem,
  IOperationItem,
  IDetailsItem,
} from '@webapi/libs/contracts';

//import { UpdateUserElsDto } from './dtos/update_user_els.dto';

import { ElsRepository } from '@webapi/app/modules/els/repositories/els.repository';
import { ElsService } from '@webapi/app/modules/els/els.service';
import { Meters_DataService } from '@webapi/app/modules/meters_data/meters_data.service';
import { UserRepository } from '../auth/user/user.repository';
import { UES_INTERNAL_SERVER_ERROR } from '@webapi/libs/constants/runtime/exception.constant';
import { IPeriod, ServiceTypeEnum } from '@webapi/libs/interfaces';

@Injectable()
export class BalanceService {
  constructor(
    private readonly elsRepository: ElsRepository,
    private readonly elsService: ElsService,
    private readonly meters_dataService: Meters_DataService,
    private readonly userRepository: UserRepository
  ) {}

  async getBalance({
    els,
    start,
    end,
  }: {
    els: string;
    start: { year: number; month: number };
    end: { year: number; month: number };
  }): Promise<any> {
    const balance = await this.elsService.getBalanceByCode({ els, start, end });

    if (!balance)
      throw new InternalServerErrorException(UES_INTERNAL_SERVER_ERROR);

    return {
      els,
      months: balance,
    };
  }

  async getBalanceByUserId({
    id,
    period,
  }: {
    id: number;
    period: IPeriod;
  }): Promise<any> {
    // this.logger.error({ userid: id, period });

    const userInfo = await this.userRepository.findOneFullInfo({ id });

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

    const balanceInfo = await this.getElsInfoByArrayElsId({ elsArray, period });

    const res = this.getJsonBalance({
      balanceInfo,
    });

    return res; //balanceInfo res;
  }

  async getMetersDataByUserId({
    id,
    period,
  }: {
    id: number;
    period: IPeriod;
  }): Promise<any> {
    const userInfo = await this.userRepository.findOneFullInfo({ id });

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

    const metersDataInfo = await this.meters_dataService.getElsInfoByArrayElsId(
      {
        elsArray,
        period,
      }
    );

    const res = this.meters_dataService.formationJsonMeters_Data({
      metersDataInfo,
    });

    return res; // metersDataInfo; res;
  }

  async getElsInfoByArrayElsId({
    elsArray,
    period,
  }: {
    elsArray: { id: number; els: string; address: string }[];
    period: IPeriod;
  }): Promise<any> {
    return Promise.all(
      elsArray.map(async (item) => {
        const { id, els, address } = item;
        const resBalance = await this.getBalance({
          els,
          ...period,
        });

        return { id, address, ...resBalance };
      })
    );
  }

  getJsonBalance({ balanceInfo }: { balanceInfo: any }): BalanceUser.Response {
    const els = this.getIElsItems(balanceInfo);

    return { els };
  }

  private getIElsItems(balanceInfo: any[]): IElsItem[] {
    return Array.isArray(balanceInfo)
      ? balanceInfo.map((oneEls) => {
          const { id, els, address } = oneEls;
          const months = Array.isArray(oneEls.months)
            ? this.getIMonthItems(oneEls.months)
            : [];

          return { id, els, address, months };
        })
      : [];
  }

  private getIMonthItems(monthItems: any[]): IMonthItem[] {
    const months = Array.isArray(monthItems)
      ? monthItems.map((oneMonth) => {
          const { billing_year, billing_month } = oneMonth;
          const account_services = this.getIAccountServicesItems(
            oneMonth.els_account
          );

          return { billing_year, billing_month, account_services };
        })
      : [];

    return months;
  }

  private getIAccountServicesItems(
    accountItems: any[]
  ): IAccountServicesItem[] {
    if (!Array.isArray(accountItems)) return [];

    const accounts = accountItems
      .sort((itemA, itemB) => {
        const {
          fk_company_id: aCompanyId,
          //code_sus: aCodeSus,
          service_type: aServiceType,
          company_service: aCompanyService,
        } = itemA.service_account;
        const {
          fk_company_id: bCompanyId,
          //code_sus: bCodeSus,
          service_type: bServiceType,
          company_service: bCompanyService,
        } = itemB.service_account;

        const aCompareStr = `${
          !aCompanyService ? 1 : aCompanyService.off_payment
        }${!aCompanyId ? 0 : aCompanyId}${
          aServiceType === ServiceTypeEnum.PENALTIES
            ? ServiceTypeEnum.END_OF_LIST
            : aServiceType
        }`;
        const bCompareStr = `${
          !bCompanyService ? 1 : bCompanyService.off_payment
        }${!bCompanyId ? 0 : bCompanyId}${
          bServiceType === ServiceTypeEnum.PENALTIES
            ? ServiceTypeEnum.END_OF_LIST
            : bServiceType
        }`;

        /* const aCompareStr = `${
          !aCompanyService ? 1 : aCompanyService.off_payment
        }${!aCompanyId ? 0 : aCompanyId}${aCodeSus}${
          aServiceType === ServiceTypeEnum.PENALTIES
            ? ServiceTypeEnum.END_OF_LIST
            : aServiceType
        }`;
        const bCompareStr = `${
          !bCompanyService ? 1 : bCompanyService.off_payment
        }${!bCompanyId ? 0 : bCompanyId}${bCodeSus}${
          bServiceType === ServiceTypeEnum.PENALTIES
            ? ServiceTypeEnum.END_OF_LIST
            : bServiceType
        }`; */

        return aCompareStr.localeCompare(bCompareStr);
      })
      .map((oneAccount) => {
        const {
          id,
          name_us: name,
          decimal_places,
          company_service,
        } = oneAccount.service_account;
        const operations = this.getIOperationItems(
          oneAccount //.account_operation
        );

        //if (!(operations.length > 0)) return { id, name, company_service };

        return { id, name, decimal_places, company_service, operations };
      });

    return accounts;
  }

  private getIOperationItems(oneAccount: any): IOperationItem[] {
    const sumPayments = Array.isArray(oneAccount.account_payment)
      ? oneAccount.account_payment.reduce((sum, item) => sum + item.sum_opl, 0)
      : 0;

    const operations = Array.isArray(oneAccount.account_operation)
      ? oneAccount.account_operation.map((oneOperation) => {
          const {
            id,
            fk_els_id: elsId,
            sum_z: balance,
            sum_opl: sumOpl,
            sum_final: sumFinal,
            measure_operation: measureOperation,
            details: detailsItems,
          } = oneOperation;

          const unit = !measureOperation ? '' : measureOperation.title;
          const details = this.getIDetailsItems({
            detailsItems, //: oneOperation.details,
            unit,
          });

          return {
            id: Number(id),
            elsId,
            balance: balance - sumOpl,
            paid: sumPayments,
            toPay: sumFinal - sumPayments < 0 ? 0 : sumFinal - sumPayments,
            details,
          };
        })
      : [];

    return operations;
  }

  private getIDetailsItems({
    detailsItems,
    unit,
  }: {
    detailsItems: any[];
    unit: string;
  }): IDetailsItem[] {
    const details = Array.isArray(detailsItems)
      ? detailsItems.map((oneDetail) => {
          const {
            id,
            sum_accrual: accrued,
            sum_recalc: recalculation,
            scope_service: quantity,
            tariff_details,
          } = oneDetail;

          const amount: IAmount = { quantity, unit };

          return {
            id: Number(id),
            accrued,
            recalculation,
            amount,
            tariff: tariff_details,
          };
        })
      : [];

    return details;
  }
}
