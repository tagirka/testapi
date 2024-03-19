import { Injectable, NotFoundException } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { ElsRepository } from './repositories/els.repository';
import { getPeriod } from '@webapi/libs/utils/helpers/date.helper';
import { UES_NOT_FOUND_ELS } from '@webapi/libs/constants/runtime/exception.constant';

@Injectable()
export class ElsService {
  constructor(
    private accountService: AccountService,
    private readonly elsRepository: ElsRepository
  ) {}

  public async getBalanceByCode({
    els,
    start,
    end,
  }: {
    els: string;
    start: { year: number; month: number };
    end: { year: number; month: number };
  }): Promise<any> {
    const res = await this.elsRepository.findOne({ els });

    if (!res) throw new NotFoundException(UES_NOT_FOUND_ELS);

    //DOIT max period=6

    const period = getPeriod(start, end) > 6 ? 6 : getPeriod(start, end);

    const months = await Promise.all(
      [...new Array(period)].map(async (_, index) => {
        const currentYear = end.month - index < 1 ? end.year - 1 : end.year;
        const currentMonth =
          end.month - index < 1 ? 12 + end.month - index : end.month - index;

        const els_account = await this.accountService.getOperationByElsId({
          elsId: res.id,
          billingYear: currentYear,
          billingMonth: currentMonth,
        }); // getAccountBalance  getOperationByElsId
        // getAccountBalance (не выдает информацию по траифам)

        return {
          billing_year: currentYear,
          billing_month: currentMonth,
          els_account,
          /* els_id: res.id,
          accurals, */
        };
      })
    );

    return months;
  }

  async findByCode(code: string) {
    return await this.elsRepository.findOne({ els: code });
  }
}
