export const CRLF = '\r\n';
//export const FIND_ELS_MASK = /^74\d{8}:/i;
export const FIND_ELS_MASK = /^\d{10}:/i;

export interface IParseBuffCsvIn {
  chunk: string;
  headers: ICsvHeader[];
  isEndFile: boolean;
  lineNumber: number;
}

export interface IParseBuffCsvOut {
  arrJson: any;
  lastStr: string;
}

export interface ICsvHeader {
  headerId: headerIdEnum;
  identifier: string;
  delimiter: string;
  arrayDelimiter?: string;
  header: IHeaderItem[];
}

export interface IHeaderItem {
  name: string;
  type: typeFieldEnum;
  header?: IHeaderArrayItem[];
}

export interface IHeaderArrayItem {
  name: string;
  type: typeFieldEnum;
}

export const enum headerIdEnum {
  MAIN = 1,
  TOTAL = 9,
}
export const enum typeFieldEnum {
  ARRAY = 'array',
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'Date',
}

const csvMainHeaderVBRR: ICsvHeader = {
  headerId: headerIdEnum.MAIN,
  identifier: '',
  delimiter: ';',
  arrayDelimiter: '[!]',
  header: [
    { name: 'datePayment', type: typeFieldEnum.STRING },
    { name: 'timePayment', type: typeFieldEnum.STRING },
    { name: 'bankBranch', type: typeFieldEnum.STRING },
    { name: 'cashierNumber', type: typeFieldEnum.STRING },
    { name: 'orderNumber', type: typeFieldEnum.STRING },
    { name: 'els', type: typeFieldEnum.STRING },
    { name: 'fullNamePayer', type: typeFieldEnum.STRING },
    { name: 'address', type: typeFieldEnum.STRING },
    { name: 'paymentPeriod', type: typeFieldEnum.STRING },
    {
      name: 'services',
      type: typeFieldEnum.ARRAY,
      header: [
        { name: 'code', type: typeFieldEnum.STRING },
        { name: 'name', type: typeFieldEnum.STRING },
        { name: 'sum', type: typeFieldEnum.NUMBER },
      ],
    },

    { name: 'amount', type: typeFieldEnum.NUMBER },
    { name: 'amountTransfer', type: typeFieldEnum.NUMBER },
    { name: 'amountCommission', type: typeFieldEnum.NUMBER },
  ],
};

const csvTotalHeaderVBRR: ICsvHeader = {
  headerId: headerIdEnum.TOTAL,
  identifier: '=',
  delimiter: ';',
  arrayDelimiter: '[!]',
  header: [
    { name: 'numberLines', type: typeFieldEnum.NUMBER },
    { name: 'amount', type: typeFieldEnum.NUMBER },
    { name: 'amountTransfer', type: typeFieldEnum.NUMBER },
    { name: 'amountCommission', type: typeFieldEnum.NUMBER },
    { name: 'numberPayment', type: typeFieldEnum.NUMBER },
    { name: 'datePayment', type: typeFieldEnum.STRING },
  ],
};

export const csvVbrrHeaders: ICsvHeader[] = [
  csvMainHeaderVBRR,
  csvTotalHeaderVBRR,
];

export interface IMainCsvItem {
  headerId: headerIdEnum.MAIN;
  datePayment: string;
  timePayment: string;
  bankBranch: string;
  cashierNumber: string;
  orderNumber: string;
  els: string;
  fullNamePayer: string;
  address: string;
  paymentPeriod: string;
  services: IServiceItem[];
  amount: number;
  amountTransfer: number;
  amountCommission: number;
}

export interface IServiceItem {
  els?: string;
  code: string;
  name: string;
  sum: number;
}

export interface ITotalCsvItem {
  headerId: headerIdEnum.TOTAL;
  numberLines: number;
  amount: number;
  amountTransfer: number;
  amountCommission: number;
  numberPayment: number;
  datePayment: string;
}

export type TUnionCsvItem = IMainCsvItem | ITotalCsvItem;
