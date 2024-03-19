import { IsNumber } from 'class-validator';

class ITariff {
  //id: number;
  title: string;
  price: number;
}
class IOperation_Details {
  sum_accrual: number;
  sum_recalc: number;
  scope_service: number;
  tariff: ITariff;
}

class IOperation {
  sum_z: number;
  sum_opl: number;
  sum_final: number;
  details: IOperation_Details;
}

class ICompany {
  //id: bigint;
  code: string;
  name: string;
  inn: string;
  address: string;
  off_payment: number;
}

class IService {
  //id: bigint;
  code_sus: string;
  name_us: string;
  company_service: ICompany;
}

class IAccount {
  //id: bigint;
  personal_account: string;
  main_unit: string;
  main_ammount: number;
  service_account: IService;
  account_operation: IOperation;
}

class IMonths {
  billing_year: number;
  billing_month: number;
  els_account: IAccount[];
}

export namespace AccountOperations {
  export const topic = 'account.operations3months.query';

  export class Request {
    @IsNumber()
    uid: number;
    @IsNumber()
    billing_year: number;
    @IsNumber()
    billing_month: number;
    @IsNumber()
    number_of_months;
  }

  export class Response {
    //id: bigint;
    els: string;
    address?: string;
    months: IMonths[];
  }
}
