import {
  DeclinationEnum,
  DelimiterEnum,
  TypeDateEnum,
  dateString,
} from '@webapi/libs/utils/helpers/date.helper';

export const UES_BILLING_YEAR = 2023;
export const UES_BILLING_MONTH = 9;

export const UES_INTERNAL_SERVER_ERROR = 'Внутреняя ошибка сервиса';

export const UES_NOT_FOUND_ELS = 'Неверный ЕЛС';

export const UES_COMMON_NOT_DATA = 'нет данных';

export const UES_MONTHS_BEFORE_CHECK = 3;

export const UES_NUM_RANDOM_ELS = 20;

export const UES_TEST_EMAIL = 'corp@uralsbyt.ru';

export const UES_VBRR_CURRENCY = 643;
export const UES_VBRR_LANGUAGE = 'en';
export const UES_VBRR_RETURN_URL =
  'https://uralsbyt.ru/clients/vzaimodeystvie-s-klientami/lichnyy-kabinet/';

export const UES_CSV_SEPARATOR = ';';
export const UES_CSV_CODE_CASH = 'Личный кабинет';
export const UES_CSV_IN_FOLDER_NAME = '../data/in';
export const UES_CSV_OUT_FOLDER_NAME = '../data/out';

export const UES_CONTROLLER_ACQUIRING_STATUS = 'acquiring/status';

export const csvFileName = ({ date_entering }: { date_entering: Date }) =>
  `pplkk${dateString(date_entering, {
    type_date: TypeDateEnum.YYYYMMDD,
    delimiter: DelimiterEnum.EMPTY,
  })}.csv`;

export const notificationTextWarning = ({
  dateCheck,
  counterNumber,
  els,
  companyName,
}: {
  dateCheck: Date;
  counterNumber: string;
  els: string;
  companyName: string;
}) =>
  `В ${dateString(dateCheck, {
    type_date: TypeDateEnum.monthYYYYyear,
    declination: DeclinationEnum.WHEN,
  })} у индивидуального прибора учета${
    counterNumber.length > 0 ? ' № ' + counterNumber + ' ' : ' '
  }ЕЛС: ${els} истекает межпроверочный интервал${
    companyName.length > 0 ? ', обратитесь в ' + companyName : ''
  }.`;

export const notificationTextError = ({
  counterNumber,
  els,
  companyName,
}: {
  counterNumber: string;
  els: string;
  companyName: string;
}) =>
  `Внимание! Необходимо осуществить проверку индивидуального прибора учета ${
    counterNumber.length > 0 ? ' № ' + counterNumber + ' ' : ' '
  }ЕЛС: ${els}${
    companyName.length > 0 ? ', обратитесь в ' + companyName : ''
  }.`;

export const enum NotificationTypeEnum {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
}

export const enum NotificationVisibilityEnum {
  POPUP = 'popup',
  ALERT = 'alert',
  INFO = 'info',
}

export const notificationLink = ({ els }: { els: string }) =>
  `/indications/${els}`;
