import { QueryPeriodDto } from '@webapi/app/modules/balance/query-period.dto';
import { IPeriod } from '@webapi/libs/interfaces';

export function addOneMonth({ month, year }: { month: number; year: number }): {
  month: number;
  year: number;
} {
  if (month + 1 > 12) return { month: 1, year: year + 1 };

  return { month: month + 1, year };
}

export const enum DelimiterEnum {
  DASH = '-',
  POINT = '.',
  EMPTY = '',
}

export const enum TypeDateEnum {
  monthYYYYyear = 1,
  DDMMYYYY = 2,
  YYYYMMDD = 3,
  HHMMSS = 4,
}

export const enum DeclinationEnum {
  WHAT = 'what',
  WHEN = 'when',
}

export function dateString(
  value: Date | null,
  {
    type_date = TypeDateEnum.DDMMYYYY,
    delimiter = DelimiterEnum.POINT,
    declination = DeclinationEnum.WHAT,
  }: {
    type_date?: TypeDateEnum;
    delimiter?: DelimiterEnum | string;
    declination?: DeclinationEnum;
  }
): string {
  if (!value) return '';

  switch (type_date) {
    case TypeDateEnum.DDMMYYYY:
      return `${value.getDate().toString(10).padStart(2, '0')}${delimiter}${(
        value.getMonth() + 1
      )
        .toString(10)
        .padStart(2, '0')}${delimiter}${value
        .getFullYear()
        .toString(10)
        .padStart(4, '0')}`;
    case TypeDateEnum.YYYYMMDD:
      return `${value
        .getFullYear()
        .toString(10)
        .padStart(4, '0')}${delimiter}${(value.getMonth() + 1)
        .toString(10)
        .padStart(2, '0')}${delimiter}${value
        .getDate()
        .toString(10)
        .padStart(2, '0')}`;
    case TypeDateEnum.monthYYYYyear:
      const months = [
        { what: 'январь', when: 'январе' },
        { what: 'февраль', when: 'феврале' },
        { what: 'март', when: 'марте' },
        { what: 'апрель', when: 'апреле' },
        { what: 'май', when: 'мае' },
        { what: 'июнь', when: 'июне' },
        { what: 'июль', when: 'июле' },
        { what: 'август', when: 'августе' },
        { what: 'сентябрь', when: 'сентябре' },
        { what: 'октябрь', when: 'октябре' },
        { what: 'ноябрь', when: 'ноябре' },
        { what: 'декабрь', when: 'декабре' },
      ];
      switch (declination) {
        case DeclinationEnum.WHAT:
          return `${months[value.getMonth()].what} ${value.getFullYear()} год`;
        case DeclinationEnum.WHEN:
          return `${months[value.getMonth()].when} ${value.getFullYear()} года`;
      }
    case TypeDateEnum.HHMMSS:
      return `${value
        .getHours()
        .toString(10)
        .padStart(2, '0')}${delimiter}${value
        .getMinutes()
        .toString(10)
        .padStart(2, '0')}${delimiter}${value
        .getSeconds()
        .toString(10)
        .padStart(2, '0')}`;
  }
}

export const setPeriod = (queryPeriodDto: QueryPeriodDto): IPeriod => {
  return {
    start: {
      year: queryPeriodDto.startyear,
      month: queryPeriodDto.startmonth,
    },
    end: {
      year: queryPeriodDto.endyear,
      month: queryPeriodDto.endmonth,
    },
  };
};

export const setDate = (year: number, month: number): Date => {
  const newDate = new Date(year, month);

  return newDate;
};

export const isDateValidate = (date: Date): boolean =>
  date instanceof Date && !isNaN(date.valueOf());

export const getPeriod = (
  start: { year: number; month: number },
  end: { year: number; month: number }
): number => (end.year - start.year) * 12 - start.month + 1 + end.month;
