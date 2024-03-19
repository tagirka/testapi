import { replacePoint } from '@webapi/libs/utils/helpers/string-options';

export const afterDecimalPoint = 0;
export const sumDivisor = Math.pow(10, 2 - afterDecimalPoint);

export const numRubleToKopeck = (sum: number) => Math.round(sum * sumDivisor);
export const strRubleToKopeck = (str: string) =>
  Math.round(parseFloat(str) * sumDivisor);
export const kopeckToRuble = (sum: number) => sum / sumDivisor;
export const parseIntOrZero = (str: string): number =>
  Object.is(parseInt(str), NaN) ? 0 : parseInt(str);
export const parseFloatOrZero = (str: string): number =>
  Object.is(parseFloat(str), NaN) ? 0 : parseFloat(str);

export const dateStrToTS = (dateStr: string): number | null => {
  const [day, month, year] = dateStr.split('.');
  const res = Date.parse(`${year}-${month}-${day}`);
  return Object.is(res, NaN) ? null : res;
};

export const csvRuble = (amount: number): string => {
  return replacePoint((Math.round(amount * 100) / 100).toString(10));
};

export const csvBpDateString = (dateStr: Date): string => {
  const year = dateStr.getFullYear().toString(10).padStart(4, '0');
  const month = (dateStr.getMonth() + 1).toString(10).padStart(2, '0');
  const day = dateStr.getDate().toString(10).padStart(2, '0');
  const hours = (dateStr.getHours() + 1).toString(10).padStart(2, '0');
  const minutes = (dateStr.getMinutes() + 1).toString(10).padStart(2, '0');
  const seconds = (dateStr.getSeconds() + 1).toString(10).padStart(2, '0');
  const milliseconds = (dateStr.getMilliseconds() + 1).toString(10);

  const res = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  return res;
};

export const billingDate = (
  dateStr: string
): { billing_year: number | null; billing_month: number | null } => ({
  billing_year: parseIntOrZero(dateStr.trim().slice(0, 4)),
  billing_month: parseIntOrZero(dateStr.trim().slice(4, 6)),
});
