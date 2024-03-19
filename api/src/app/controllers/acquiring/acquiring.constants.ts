export const CSV_PREFIXES = [
  { prefix: 'LK', terminal: '24455770' },
  { prefix: 'LKSP', terminal: '24455771' },
  { prefix: 'LKSP', terminal: '28244576' },
];
export const CSV_INN = '7453338785';
export const CSV_DEPARTMENT_NUMBER = '8597';
export const CSV_NUMBER_COLUMNS_IN_XLSX_FILE = 23;

export const enum XlsxEnum {
  inn = 0,
  nameLegalEntity = 1,
  addressLegalEntity = 2,
  bankBranch = 3,
  orderNumber = 4, //+
  shortTitle = 5,
  cashierNumber = 6, //+
  terminalNumber = 7, //+
  dateOperation = 8, //+
  dateDownload = 9,
  amount = 10, //+
  amountCommission = 11, //+
  amountTransfer = 12, //+
  cardNumber = 13,
  codeAuthorization = 14,
  typeOperation = 15,
  product = 16,
  addInformation_1 = 17,
  addInformation_2 = 18,
  paymentSystem = 19,
  payNumber = 20, //+
  payDate = 21, //+
  payAmount = 22,
}

export const xlsxVariables: {
  name: string;
  num: number;
  type: string;
  allowNull: boolean;
  turnOn: boolean;
}[] = [
  { name: 'inn', num: 0, type: 'string', allowNull: true, turnOn: false },
  {
    name: 'nameLegalEntity',
    num: 1,
    type: 'string',
    allowNull: true,
    turnOn: false,
  },
  {
    name: 'addressLegalEntity',
    num: 2,
    type: 'string',
    allowNull: true,
    turnOn: false,
  },
  {
    name: 'bankBranch',
    num: 3,
    type: 'string',
    allowNull: true,
    turnOn: false,
  },
  {
    name: 'orderNumber',
    num: 4,
    type: 'string',
    allowNull: false,
    turnOn: true,
  }, //+
  {
    name: 'shortTitle',
    num: 5,
    type: 'string',
    allowNull: true,
    turnOn: false,
  },
  {
    name: 'cashierNumber',
    num: 6,
    type: 'string',
    allowNull: false,
    turnOn: true,
  }, //+
  {
    name: 'terminalNumber',
    num: 7,
    type: 'string',
    allowNull: false,
    turnOn: true,
  }, //+
  {
    name: 'dateOperation',
    num: 8,
    type: 'number',
    allowNull: false,
    turnOn: true,
  }, //+
  {
    name: 'dateDownload',
    num: 9,
    type: 'number',
    allowNull: true,
    turnOn: false,
  },
  { name: 'amount', num: 10, type: 'number', allowNull: false, turnOn: true }, //+
  {
    name: 'amountCommission',
    num: 11,
    type: 'number',
    allowNull: true,
    turnOn: true,
  }, //+
  {
    name: 'amountTransfer',
    num: 12,
    type: 'number',
    allowNull: false,
    turnOn: true,
  }, //+
  {
    name: 'cardNumber',
    num: 13,
    type: 'string',
    allowNull: true,
    turnOn: false,
  },
  {
    name: 'codeAuthorization',
    num: 14,
    type: 'string',
    allowNull: true,
    turnOn: false,
  },
  {
    name: 'typeOperation',
    num: 15,
    type: 'string',
    allowNull: true,
    turnOn: false,
  },
  { name: 'product', num: 16, type: 'string', allowNull: true, turnOn: false },
  {
    name: 'addInformation_1',
    num: 17,
    type: 'string',
    allowNull: true,
    turnOn: false,
  },
  {
    name: 'addInformation_2',
    num: 18,
    type: 'string',
    allowNull: true,
    turnOn: false,
  },
  {
    name: 'paymentSystem',
    num: 19,
    type: 'string',
    allowNull: true,
    turnOn: false,
  },
  {
    name: 'payNumber',
    num: 20,
    type: 'string',
    allowNull: false,
    turnOn: true,
  }, //+
  { name: 'payDate', num: 21, type: 'number', allowNull: false, turnOn: true }, //+
  {
    name: 'payAmount',
    num: 22,
    type: 'number',
    allowNull: true,
    turnOn: false,
  },
];
