import { ElsEntity } from '../../app/modules/els/entities/els.entity';
import { UserModel } from '../../app/controllers/auth/user/models/user.model';

export interface IApiDBtoDB {
  table?: string;
  res: string | any | null;
  err: string | null;
  status: boolean;
  eof?: boolean;
  rows?: any; //InternalTableType[];
  results?: {
    table?: string;
    res: string | null;
    err: string | null;
    status: boolean;
  }[];
}

export interface IMainAnswer {
  res: string | null;
  err: string | null;
  status: boolean;
}
export type InternalTableType = ElsEntity | UserModel;

export interface IExtendedAnswer extends IMainAnswer {
  table?: string;
  rows?: any[];
}

export interface IBilling_Date {
  billing_year: number;
  billing_month: number;
}

export interface IPeriodQuery {
  startmonth: number;
  startyear: number;
  endmonth: number;
  endyear: number;
}

export interface IPeriod {
  start: { year: number; month: number };
  end: { year: number; month: number };
}

export const enum ServiceTypeEnum {
  SERVICE = 'SERVICE',
  PENALTIES = 'PENALTIES',
  END_OF_LIST = 'ZZZZZZZZZ',
}

export const enum TableOptionsEnum {
  COUNT = 'count',
  MAXID = 'maxID',
  MINID = 'minID',
}

export interface ITableOptions {
  minID?: number;
  maxID?: number;
  count?: number;
}
