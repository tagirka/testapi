import { IsNumber } from 'class-validator';

export interface IService {
  cose_sus: string;
  name_us: string;
}

export interface IAccount {
  personal_account: string;
  service: IService;
  main_unit: string;
  main_ammount: number;
}

//export namespace AccountService {
export const topic = 'account.account-service.query';

export class Request {
  @IsNumber()
  userId: number;
}

export class Response {
  userId: number;

  address: string;

  accounts: IAccount[];
}

//}
