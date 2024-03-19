import { IMeters_DataItem } from '@webapi/libs/contracts';

export interface IElsItem {
  id: number; //els->id
  els: number; //els->els
  address: string; //els->fk_build_id (join "build")->address_string
  months: IMonthItem[];
}
export interface IMonthItem {
  billing_year: number;
  billing_month: number;
  account_services: IAccountServicesItem[];
}
export interface IAccountServicesItem {
  id: number; // operation -> id
  name: string; // ? сервис наименование
  decimal_places: number;
  company_service: ICompany;
  operations?: IOperationItem[];
  meters_data?: IMeters_DataItem;
}
export interface ICompany {
  id: number;
  code: string; //company->code
  name: string; //company->name
  inn: string; //company->inn
  address: string; //company->address
  //requisite: string; //?
  off_payment: number; //company->off_payment
}
export interface IOperationItem {
  id: number;
  elsId: number;
  balance: number; // operation -> sum_z
  paid: number; // operation -> sum_opl
  toPay: number; // operation -> sum_final
  details: IDetailsItem[];
}
export interface IDetailsItem {
  id: number; // operation_details -> id (bigint)
  accrued?: number; // operation_details -> sum_accrual
  recalculation?: number; // operation_details -> sum_recalc
  amount: IAmount;
  tariff: ITariff;
}
export interface ITariff {
  id: number;
  title: string;
  price: number;
}
export interface IAmount {
  quantity: number; // operation_details -> scope_service
  unit: string; // measure -> title
}
export interface IConstants {
  isReadings: boolean;
}

export namespace BalanceUser {
  export const topic = 'balance.user.query';

  export class Request {
    userId: string;
    start_year: number;
    start_month: number;
    end_year: number;
    end_month: number;
  }

  export class Response {
    //user: IUser;
    els: IElsItem[];
    //constants: IConstants;
  }
}

/* const userInfo = {
  id: 3,
  last_name: 'Хасанов',
  first_name: 'Ильдар\n',
  patronymic: 'Сабирьянович',
  email: 'Khasanoff@mail.ru\n',
  phone: '89125366918',
  email_confirmed: true,
  phone_confirmed: true,
  els: [
    {
      id: 6,
      els: '7401770936',
      naming_els: {
        short_name: 'Ц. А. Г.',
        last_name: 'Ц',
        first_name: 'А',
        patronymic: 'Г',
      },
      build_els: {
        address_string: 'Челябинская обл., Копейск, Ул. Сутягина, дом 4, кв. 3',
      },
    },
    {
      id: 7,
      els: '7402285626',
      naming_els: {
        short_name: 'Т. Л. В.',
        last_name: 'Т',
        first_name: 'Л',
        patronymic: 'В',
      },
      build_els: {
        address_string:
          'Челябинская обл., Копейск, Ул. Российская, дом 27А, кв. 9',
      },
    },
  ],
};

const elsArr = {
  els: '7401771943',
  address: 'Нет данных',
  months: [
    {
      billing_year: 2023,
      billing_month: 8,
      els_account: [
        {
          personal_account: '0000116007',
          service_account: {
            code_sus: 'SE2',
            name_us: 'Пени',
            company_service: {
              code: '9001',
              name: 'ООО ""Уралэнергосбыт""',
              inn: '7453313477',
              address:
                'Банк ГПБ (АО), г.Москва, р/с 40702810200000032714, БИК 044525823, к/счёт 30101810200000000823',
              off_payment: 0,
            },
          },
          account_operation: [
            {
              sum_z: 186,
              sum_opl: 186,
              sum_final: 797,
              details: [
                {
                  sum_accrual: 797,
                  sum_recalc: 0,
                  scope_service: '0.000000',
                },
              ],
            },
          ],
        },
        {
          personal_account: '0000116007',
          service_account: {
            code_sus: 'SE1',
            name_us: 'Быт.потребление ЭЭ',
            company_service: {
              code: '9001',
              name: 'ООО ""Уралэнергосбыт""',
              inn: '7453313477',
              address:
                'Банк ГПБ (АО), г.Москва, р/с 40702810200000032714, БИК 044525823, к/счёт 30101810200000000823',
              off_payment: 0,
            },
          },
          account_operation: [
            {
              sum_z: 150801,
              sum_opl: 357834,
              sum_final: 0,
              details: [
                {
                  sum_accrual: 62953,
                  sum_recalc: 132733,
                  scope_service: '190.990000',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      billing_year: 2023,
      billing_month: 7,
      els_account: [
        {
          personal_account: '0000116007',
          service_account: {
            code_sus: 'SE2',
            name_us: 'Пени',
            company_service: {
              code: '9001',
              name: 'ООО ""Уралэнергосбыт""',
              inn: '7453313477',
              address:
                'Банк ГПБ (АО), г.Москва, р/с 40702810200000032714, БИК 044525823, к/счёт 30101810200000000823',
              off_payment: 0,
            },
          },
          account_operation: [
            {
              sum_z: 0,
              sum_opl: 0,
              sum_final: 186,
              details: [
                {
                  sum_accrual: 186,
                  sum_recalc: 0,
                  scope_service: '0.000000',
                },
              ],
            },
          ],
        },
        {
          personal_account: '0000116007',
          service_account: {
            code_sus: 'SE1',
            name_us: 'Быт.потребление ЭЭ',
            company_service: {
              code: '9001',
              name: 'ООО ""Уралэнергосбыт""',
              inn: '7453313477',
              address:
                'Банк ГПБ (АО), г.Москва, р/с 40702810200000032714, БИК 044525823, к/счёт 30101810200000000823',
              off_payment: 0,
            },
          },
          account_operation: [
            {
              sum_z: 111801,
              sum_opl: 0,
              sum_final: 150801,
              details: [
                {
                  sum_accrual: 39000,
                  sum_recalc: 0,
                  scope_service: '100.000000',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const front = {
  user: {
    userId: 3,
    firstName: 'Иван',
    patronymic: 'Дмитриевич',
    lastName: 'Поляков',
    email: 'ivan.master@gmail.com',
    main_address: 'г. Златоуст, ул.Еловая 5, кв.77',
    phone: '892212345678',
    emailConfirmed: true,
    phoneConfirmed: true,
  },

  els: [
    {
      els: 7400299182,
      userId: 1,
      address: 'Челябинск, Новосинеглазово, ул. Чехова, дом 2А, кв. 70,',
      account_services: [
        {
          id: 100,
          name: 'Бытовое потребление ЭЭ',
          company_service: {
            code: '660',
            name: 'ООО "ЦКС"',
            inn: '7456027298',
            address: 'Филиал ""Центральный"" Банка ВТБ (ПАО) в г. Москве',
            requisite: 'р/с 5555555555, БИК 044525411, к/счёт 40595868676',
            // (возм-ть оплаты есть или нет на сайте ,где 1 -нет, 0-есть)
            off_payment: 0,
          },
          // долг переплата
          balance: 4680,
          // оплачено
          paid: 6000,
          //показывать ед для обьема потребления или нет
          //isAmount: true,
          // к оплате
          toPay: 8680,
          // (массив тк данные могут быть многотарифные и соот-но по каждому тарифу есть начислено, перерасчет, id, обьем пореления)
          details: [
            {
              tariff: 3.9,
              accrued: 2000,
              //(переррасчет)
              recalculation: 400,
              id: 0,
              amount: {
                //(об-ем потербления)
                quantity: 130,
                unit: 'Квт.ч',
              },
            },
            {
              tariff: 3.9,
              accrued: 2000,
              recalculation: 400,
              id: 1,
              amount: {
                quantity: 130,
                unit: 'Квт.ч',
              },
            },
          ],
          //billingMonth: 'июль',
          //billingYear: '2023',

          indications: {
            counterType: 'индивидуальный',
            // номер счетчика
            counterNumber: '71801279411982',
            // дата поверки
            nextCheckDate: '17.01.2024',
            // разрядность счетчика
            VOL_MAX_LENGTH: 5,
            details: [
              {
                // ПОСЛЕДНЕЕ ПОКАЗАНИЕ
                startPeriodIndications: 97782,
                // текущее показания
                enteredIndication: 0,
                id: 0,
              },
              {
                startPeriodIndications: 99987,
                enteredIndication: 0,
                id: 1,
              },
            ],
            enteredCheckDate: '24.07.2023',
            currentCheckDate: '0',
            // количество прожив-их
            residents: 2,
            accomodation: 'Помещение',
          },
        },
        {
          id: 120,
          name: 'Общедом.потреб.ЭЭ',
          company_service: {
            code: '660',
            name: 'ООО "ЦКС"',
            inn: '7456027298',
            requisite: 'р/с 5555555555, БИК 044525411, к/счёт 40595868676',
            address: 'Филиал ""Центральный"" Банка ВТБ (ПАО) в г. Москве',
            off_payment: 0,
          },
          details: [
            {
              tariff: 3.9,
              accrued: 5597,
              recalculation: 3108,
              id: 0,
              amount: {
                quantity: 14.35,
                unit: 'Квт.ч',
              },
            },
          ],
          billingMonth: 'июль',
          billingYear: '2023',
          balance: 0,
          paid: 0,
          isAmount: true,
          toPay: 0,
          indications: {
            counterType: 'индивидуальный',
            nextCheckDate: '17.01.2023',
            currentCheckDate: '24.08.2023',
            details: [
              {
                startPeriodIndications: 3655,
                enteredIndication: 0,
                id: 0,
              },
              {
                startPeriodIndications: 3655,
                enteredIndication: 0,
                id: 1,
              },
            ],
            enteredCheckDate: '24.07.2023',
            residents: 2,
            accomodation: 'Помещение',
          },
        },
        {
          id: 110,
          name: 'Водоснабжение',
          company_service: {
            code: '660',
            name: 'ООО "ЦКС"',
            inn: '7456027298',
            requisite: 'р/с 5555555555, БИК 044525411, к/счёт 40595868676',
            address: 'Филиал ""Центральный"" Банка ВТБ (ПАО) в г. Москве',
            off_payment: 1,
          },
          details: [
            {
              tariff: 3.9,
              accrued: 2000,
              recalculation: 400,
              id: 0,
              amount: {
                quantity: 130,
                unit: 'Квт.ч',
              },
            },
          ],
          billingMonth: 'июль',
          billingYear: '2023',
          balance: 4680,
          paid: 6000,
          isAmount: true,
          toPay: 8680,
          indications: {
            counterType: 'индивидуальный',
            counterNumber: '19287149',
            nextCheckDate: '17.01.2024',
            currentCheckDate: '0',
            details: [
              {
                startPeriodIndications: 3655,
                enteredIndication: 0,
                id: 0,
              },
            ],
            enteredCheckDate: '24.07.2023',
            residents: 2,
            accomodation: 'Помещение',
          },
        },
        {
          id: 300,
          name: 'ТЭ на попдогрев(ГВС)',
          company_service: {
            code: '660',
            name: 'ООО ""Уралэнергосбыт""',
            inn: '7456027298',
            requisite: 'р/с 5555555555, БИК 044525411, к/счёт 40595868676',
            address: 'Филиал ""Центральный"" Банка ВТБ (ПАО) в г. Москве',
            off_payment: 0,
          },
          details: [
            {
              tariff: 155960,
              accrued: 14567,
              recalculation: -219,
              id: 0,
              amount: {
                quantity: 0.093,
                unit: 'Гкал',
              },
            },
          ],
          billingMonth: 'июль',
          billingYear: '2023',
          balance: 3241,
          paid: 3241,
          isAmount: true,
          toPay: 14348,
          indications: {
            counterType: 'индивидуальный',
            counterNumber: '71801279411983',
            nextCheckDate: '15.03.2026',
            currentCheckDate: '24.08.2023',
            details: [
              {
                startPeriodIndications: 3655,
                enteredIndication: 5002,
                id: 0,
              },
            ],
            unit: 'Гкал',
            enteredCheckDate: '29.07.2023',
            residents: 1,
            accomodation: 'Помещение',
          },
        },
        {
          id: 600,
          name: 'Домофон',
          company_service: {
            code: '660',
            name: 'ООО ""ЦКС"" (660)',
            inn: '7456027298',
            requisite: 'р/с 5555555555, БИК 044525411, к/счёт 40595868676',
            address: 'Филиал ""Центральный"" Банка ВТБ (ПАО) в г. Москве',
            off_payment: 1,
          },
          details: [
            {
              tariff: 0,
              id: 0,
              amount: {
                quantity: 0,
                unit: '',
              },
              accrued: 7000,
              recalculation: 0,
            },
          ],
          balance: 0,
          paid: 0,
          isAmount: false,
          toPay: 7000,
          indications: {
            counterType: 'индивидуальный',
            nextCheckDate: '17.01.2024',
            details: [
              {
                startPeriodIndications: 3655,
                enteredIndication: 3655,
                id: 0,
              },
            ],
            unit: 'Квт.ч',
            enteredCheckDate: '17.01.2024',
            currentCheckDate: '24.07.2023',
            residents: 3,
            accomodation: 'Помещение',
          },
        },
        {
          id: 400,
          name: 'Обращение с ТКО',
          company_service: {
            code: '660',
            name: 'ООО ""ЦКС"" (660)',
            inn: '7456027298',
            requisite: 'р/с 5555555555, БИК 044525411, к/счёт 40595868676',
            address: 'Филиал ""Центральный"" Банка ВТБ (ПАО) в г. Москве',
            off_payment: 0,
          },
          details: [
            {
              amount: {
                quantity: 0.87,
                unit: 'Куб.м',
              },
              accrued: 47556,
              recalculation: 0,
              id: 0,
              tariff: 54662,
            },
          ],
          billingMonth: 'июль',
          billingYear: '2023',
          balance: 690224,
          paid: 0,
          isAmount: true,
          toPay: -47600,
          indications: {
            counterType: 'индивидуальный',
            counterNumber: '71801279411982',
            nextCheckDate: '17.01.2024',
            details: [
              {
                startPeriodIndications: 3655,
                enteredIndication: 3655,
                id: 0,
              },
            ],
            enteredCheckDate: '17.01.2024',
            currentCheckDate: '24.08.2023',
            residents: 1,
            accomodation: 'Помещение',
          },
        },
        {
          id: 900,
          name: 'Пени',
          company_service: {
            code: '660',
            name: 'ООО ""ЦКС""',
            inn: '7456027298',
            requisite: 'р/с 5555555555, БИК 044525411, к/счёт 40595868676',
            address: 'Филиал ""Центральный"" Банка ВТБ (ПАО) в г. Москве',
            off_payment: 0,
          },
          details: [
            {
              amount: {
                quantity: 0,
                unit: '',
              },
              accrued: 839,
              recalculation: 0,
              tariff: 0,
              id: 0,
            },
          ],
          billingMonth: 'июль',
          billingYear: '2023',
          balance: 817,
          paid: 0,
          isAmount: false,
          toPay: 1656,
          indications: {
            counterType: 'индивидуальный',
            nextCheckDate: '17.01.2024',
            details: [
              {
                startPeriodIndications: 3655,
                enteredIndication: 3655,
                id: 0,
              },
            ],
            unit: 'Квт.ч',
            enteredCheckDate: '17.01.2024',
            currentCheckDate: '24.08.2023',
            residents: 4,
            accomodation: 'Помещение',
          },
        },
      ],
    },

    // здесь елс для общежития признак - нет ни одного counterType
    {
      els: 7400169765,
      userId: 1,
      address: 'Челябинск, ул. Болейко, дом 7А, кв. 1/3,4',
      account_services: [
        {
          id: 120,
          name: 'Общедом.потреб.ЭЭ',
          company_service: {
            code: '660',
            name: 'ООО "ЦКС"',
            inn: '7456027298',
            requisite: 'р/с 5555555555, БИК 044525411, к/счёт 40595868676',
            address: 'Филиал ""Центральный"" Банка ВТБ (ПАО) в г. Москве',
            off_payment: 0,
          },
          details: [
            {
              tariff: 3.9,
              accrued: 5597,
              recalculation: 3108,
              id: 0,
              amount: {
                quantity: 14.35,
                unit: 'Квт.ч',
              },
            },
          ],
          billingMonth: 'июль',
          billingYear: '2023',
          balance: 0,
          paid: 0,
          isAmount: true,
          toPay: 0,
          indications: {
            nextCheckDate: '17.01.2023',
            currentCheckDate: '24.08.2023',
            details: [
              {
                startPeriodIndications: 3655,
                enteredIndication: 0,
                id: 0,
              },
              {
                startPeriodIndications: 3655,
                enteredIndication: 0,
                id: 1,
              },
            ],
            enteredCheckDate: '24.07.2023',
            residents: 2,
            accomodation: 'Помещение',
          },
        },
        {
          id: 110,
          name: 'Водоснабжение',
          company_service: {
            code: '660',
            name: 'ООО "ЦКС"',
            inn: '7456027298',
            requisite: 'р/с 5555555555, БИК 044525411, к/счёт 40595868676',
            address: 'Филиал ""Центральный"" Банка ВТБ (ПАО) в г. Москве',
            off_payment: 1,
          },
          details: [
            {
              tariff: 3.9,
              accrued: 2000,
              recalculation: 400,
              id: 0,
              amount: {
                quantity: 130,
                unit: 'Квт.ч',
              },
            },
          ],
          billingMonth: 'июль',
          billingYear: '2023',
          balance: 4680,
          paid: 6000,
          isAmount: true,
          toPay: 8680,
          indications: {
            counterNumber: '19287149',
            nextCheckDate: '17.01.2024',
            currentCheckDate: '0',
            details: [
              {
                startPeriodIndications: 3655,
                enteredIndication: 0,
                id: 0,
              },
            ],
            enteredCheckDate: '24.07.2023',
            residents: 2,
            accomodation: 'Помещение',
          },
        },
        {
          id: 600,
          name: 'Домофон',
          company_service: {
            code: '660',
            name: 'ООО ""ЦКС"" (660)',
            inn: '7456027298',
            requisite: 'р/с 5555555555, БИК 044525411, к/счёт 40595868676',
            address: 'Филиал ""Центральный"" Банка ВТБ (ПАО) в г. Москве',
            off_payment: 1,
          },
          details: [
            {
              tariff: 0,
              id: 0,
              amount: {
                quantity: 0,
                unit: '',
              },
              accrued: 7000,
              recalculation: 0,
            },
          ],
          balance: 0,
          paid: 0,
          isAmount: false,
          toPay: 7000,
          indications: {
            nextCheckDate: '17.01.2024',
            details: [
              {
                startPeriodIndications: 3655,
                enteredIndication: 3655,
                id: 0,
              },
            ],
            unit: 'Квт.ч',
            enteredCheckDate: '17.01.2024',
            currentCheckDate: '24.07.2023',
            residents: 3,
            accomodation: 'Помещение',
          },
        },
      ],
    },
  ],
  // здесь остальные данные которые могут быть необходимы ( сейчас  только значение по которому высчитывается в-ть или нев-ть приема показаний )
  constants: {
    isReadings: false,
  },
};
 */
