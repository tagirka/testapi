import { IsNumber } from 'class-validator';

class IOperation_Details {
  sum_accrual: number;
  sum_recalc: number;
  scope_service: number;
}

class IOperation {
  sum_z: number;
  sum_opl: number;
  sum_final: number;
  details: IOperation_Details;
}

class IService {
  code_sus: string;
  name_us: string;
}

class IAccount {
  personal_account: string;
  main_unit: string;
  main_ammount: number;
  service_account: IService;
  account_operation: IOperation;
}

class IAccount_Els {
  els: string;
  address?: string;
  els_account: IAccount[];
}

export namespace AccountEls {
  export const topic = 'account.els.query';

  export class Request {
    @IsNumber()
    uid: number;
    @IsNumber()
    billing_year: number;
    @IsNumber()
    billing_month: number;
  }

  export class Response {
    els: IAccount_Els;
  }
}
