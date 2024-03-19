import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { existsSync, statSync, createReadStream, createWriteStream } from 'fs';
import * as iconv from 'iconv-lite';

import {
  UES_CSV_IN_FOLDER_NAME,
  UES_CSV_OUT_FOLDER_NAME,
  UES_CSV_SEPARATOR,
} from '@webapi/libs/constants/runtime/exception.constant';
// import {
//   CSV_PREFIXES,
//   CSV_INN,
//   CSV_DEPARTMENT_NUMBER,
//   CSV_NUMBER_COLUMNS_IN_XLSX_FILE,
//   xlsxVariables,
// } from './acquiring.constants';
import {
  CRLF,
  FIND_ELS_MASK,
  IParseBuffCsvIn,
  IParseBuffCsvOut,
  typeFieldEnum,
  headerIdEnum,
  ICsvHeader,
  IHeaderItem,
  IHeaderArrayItem,
  csvVbrrHeaders,
  IMainCsvItem,
  IServiceItem,
  ITotalCsvItem,
  TUnionCsvItem,
} from './types/csv.types';
import { kopeckToRuble, csvRuble } from '@webapi/libs/utils';
import { getUniqueArray } from '@webapi/libs/utils/helpers/array-options';
import {
  replacePoint,
  replaceComma,
} from '@webapi/libs/utils/helpers/string-options';
// import {
//   dateString,
//   TypeDateEnum,
//   DelimiterEnum,
// } from '@webapi/libs/utils/helpers/date.helper';

import { AcquiringRepository } from './repositories/acquiring.repository';
import { BasketRepository } from './repositories/basket.repository';
import { OperationService } from '@webapi/app/modules/operation/operation.service';

@Injectable()
export class AcquiringCsvService {
  constructor(
    @InjectPinoLogger(AcquiringCsvService.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
    private readonly acquiringRepository: AcquiringRepository,
    private readonly basketRepository: BasketRepository,
    private readonly operationService: OperationService //private readonly operationRepository: OperationRepository
  ) {}

  async getCsvFilesVBRR(fileName: string): Promise<string> {
    try {
      const parsePayments = await this.parseCsv({
        fileFullName: join(UES_CSV_IN_FOLDER_NAME, fileName),
        headers: csvVbrrHeaders,
      });

      const payments = this.csvFileChecking(parsePayments);

      return await this.csvFileFormation({ fileName, payments });
    } catch (err) {
      if (err.name === 'Error')
        throw new InternalServerErrorException(
          `Error formation CSV-file. ${err.message}`
        );
      throw err;
    }
  }

  private async csvFileFormation({
    fileName,
    payments,
  }: {
    fileName: string;
    payments: any[]; //Array<IMainCsvItem[] | ITotalCsvItem>
  }): Promise<string> {
    const fileFullName = join(UES_CSV_OUT_FOLDER_NAME, fileName);
    if (existsSync(fileFullName))
      throw new Error(`Found file with name ${fileName}`);

    try {
      const out = createWriteStream(fileFullName);

      payments.forEach((item) => {
        const csvString = Array.isArray(item)
          ? item.map((el) => this.getCsvString(el)).join(CRLF)
          : this.getEndCsvString(item);

        out.write(iconv.encode(`${csvString}${CRLF}`, 'windows-1251'));
      });

      out.end();

      return fileName;
    } catch (err) {
      throw new Error(`Error writing data to file: ${fileFullName}. [${err}]`);
    }
  }

  private csvFileChecking(
    mainPayments: (IMainCsvItem | ITotalCsvItem)[]
  ): any[] | null {
    const total = {
      numberLines: 0,
      amount: 0,
      amountTransfer: 0,
      amountCommission: 0,
      isError: false,
    };

    const res = mainPayments
      .filter((item) => item.headerId === headerIdEnum.MAIN)
      .map((item: IMainCsvItem) => {
        const services = this.parseEls(item.services);

        if (Object.is(services, null)) {
          this.logger.warn(`There is no ELS sign in the basket.`);
          total.isError = true;
          return null;
        }

        const uniqueElss = getUniqueArray(services.map((el) => el.els));

        const { payments, totalPayment } = this.splitBasketIntoEls({
          payment: { ...item, services },
          uniqueElss,
        });

        total.numberLines += totalPayment.numberLines;
        total.amount += totalPayment.amount;
        total.amountTransfer += totalPayment.amountTransfer;
        total.amountCommission += totalPayment.amountCommission;

        return payments;
      });

    const endDatas = mainPayments.filter(
      (item) => item.headerId === headerIdEnum.TOTAL
    );

    if (endDatas.length !== 1) {
      this.logger.warn(
        `The number of rows with the total is different from one.`
      );
      total.isError = true;
    }

    if (total.isError) throw new Error(`Data validation error`);

    return [
      ...res,
      {
        ...endDatas[0],
        numberLines: total.numberLines,
        amount: total.amount,
        amountTransfer: total.amountTransfer,
        amountCommission: total.amountCommission,
      },
    ];
  }

  private parseEls(services: IServiceItem[]): IServiceItem[] | null {
    const res = services
      .map((item) => {
        const findEls = item.code.match(FIND_ELS_MASK);

        return Object.is(findEls, null) ||
          !Array.isArray(findEls) ||
          !findEls.length
          ? null
          : {
              ...item,
              els: findEls[0].slice(0, -1),
              code: item.code.replace(FIND_ELS_MASK, ''),
            };
      })
      .filter((item) => !Object.is(item, null));
    return res.length != services.length ? null : res;
  }

  private splitBasketIntoEls({
    payment,
    uniqueElss,
  }: {
    payment: IMainCsvItem;
    uniqueElss: string[];
  }): {
    payments: IMainCsvItem[];
    totalPayment: {
      numberLines: number;
      amount: number;
      amountTransfer: number;
      amountCommission: number;
    };
  } {
    const totalPayment = {
      numberLines: uniqueElss.length,
      amount: 0,
      amountTransfer: 0,
      amountCommission: 0,
    };
    const maxAmount = {
      amount: 0,
      index: 0,
    };

    const payments = uniqueElss.map((item, index) => {
      const services = payment.services.filter((el) => el.els === item);
      const amount = services.reduce((sum, cur) => sum + cur.sum, 0);
      const amountCommission =
        payment.amount <= 0
          ? 0
          : Math.round(
              (amount / payment.amount) * payment.amountCommission * 100
            ) / 100;
      const amountTransfer = amount - amountCommission;

      totalPayment.amount += amount;
      totalPayment.amountTransfer += amountTransfer;
      totalPayment.amountCommission += amountCommission;

      if (!maxAmount.amount || maxAmount.amount < amount) {
        maxAmount.amount = amount;
        maxAmount.index = index;
      }

      return {
        ...payment,
        els: item,
        services,
        amount,
        amountTransfer,
        amountCommission,
      };
    });

    if (totalPayment.amountCommission !== payment.amountCommission) {
      payments[maxAmount.index].amountCommission +=
        payment.amountCommission - totalPayment.amountCommission;
      payments[maxAmount.index].amountTransfer =
        payments[maxAmount.index].amount -
        payments[maxAmount.index].amountCommission;
    }

    return { payments, totalPayment };
  }

  private getCsvString(item: IMainCsvItem): string {
    const basketSubString = item.services
      .map((row) => {
        const { code, name, sum } = row;
        return [`${code}`, `${name}`, `${replacePoint(sum.toString(10))}`].join(
          UES_CSV_SEPARATOR
        );
      })
      .join(UES_CSV_SEPARATOR);

    const resString = [
      `${item.datePayment}`,
      `${item.timePayment}`,
      `${item.bankBranch}`,
      `${item.cashierNumber}`,
      `${item.orderNumber}`,
      `${item.els}`,
      `${item.fullNamePayer}`,
      `${item.address}`,
      `${item.paymentPeriod}`,
      `[!]`,
      `${basketSubString}`,
      `[!]`,
      `${csvRuble(item.amount)}`,
      `${csvRuble(item.amountTransfer)}`,
      `${csvRuble(item.amountCommission)}`,
    ].join(UES_CSV_SEPARATOR);

    return resString;
  }

  private getEndCsvString(item: ITotalCsvItem): string {
    const resString = [
      `=${item.numberLines}`,
      `${csvRuble(item.amount)}`,
      `${csvRuble(item.amountTransfer)}`,
      `${csvRuble(item.amountCommission)}`,
      `${item.numberPayment}`,
      `${item.datePayment}`,
    ].join(UES_CSV_SEPARATOR);

    return resString;
  }

  private async parseCsv({
    fileFullName,
    headers,
  }: {
    fileFullName: string;
    headers: ICsvHeader[];
  }): Promise<any[]> {
    try {
      if (!existsSync(fileFullName))
        throw new Error(`File not found: ${fileFullName}`);

      const inFile = {
        unReadVolume: statSync(fileFullName).size,
        numberRowsProcessed: 0,
        topStr: '',
        isError: false,
      };

      const strim = createReadStream(fileFullName)
        .pipe(iconv.decodeStream('win1251'))
        .pipe(iconv.encodeStream('utf8'));

      const res = [];

      for await (const chunk of strim) {
        const strChunk = chunk.toString();
        inFile.unReadVolume -= strChunk.length;

        const parseBuffCsv = this.parseCsvBuffer({
          chunk: inFile.topStr + strChunk,
          headers,
          isEndFile: inFile.unReadVolume <= 0,
          lineNumber: inFile.numberRowsProcessed,
        });
        inFile.topStr = parseBuffCsv.lastStr;
        inFile.numberRowsProcessed += parseBuffCsv.arrJson.length;

        if (!inFile.isError) {
          if (parseBuffCsv.arrJson.some((item) => Object.is(item, null))) {
            inFile.isError = true;
            res.length = 0; //res.splice(0,res.length);
          } else res.push(...parseBuffCsv.arrJson);
        }
      }

      if (inFile.isError) throw new Error(`String processing error`);

      return res;
    } catch (err) {
      throw new Error(`Error working with file: ${fileFullName}. [${err}]`);
    }
  }

  private parseCsvBuffer({
    chunk,
    headers,
    isEndFile,
    lineNumber,
  }: IParseBuffCsvIn): IParseBuffCsvOut {
    const isEndCrLf: boolean = chunk.endsWith(CRLF);
    const arrStr = (isEndCrLf ? chunk.slice(0, -CRLF.length) : chunk).split(
      CRLF
    );

    const lastStr = isEndFile ? '' : isEndCrLf ? '' : arrStr.pop();
    const arrJson = arrStr.map((item, index) => {
      if (!item.trim().length) {
        this.logger.warn(
          `Data in line .CSV file, numbered ${
            lineNumber + index + 1
          } are missing. This line is ignored.`
        );
        return null;
      }

      return this.parseCsvStrToJson({
        csvStr: item,
        headers,
        lineNumber: lineNumber + index + 1,
      });
    });

    return { arrJson, lastStr };
  }

  // возвращает строку CSV в виде JSON
  private parseCsvStrToJson({
    csvStr,
    headers,
    lineNumber,
  }: {
    csvStr: string;
    headers: ICsvHeader[];
    lineNumber: number;
  }): any | null {
    headers.sort(
      (itemA, itemB) => itemB.identifier.length - itemA.identifier.length
    );
    const headerItem = headers.find(
      (item) => !item.identifier.length || !csvStr.indexOf(item.identifier)
    );
    if (!headerItem) {
      this.logger.warn(
        `String does not match format. Line number: ${lineNumber}. This line is ignored.`
      );
      return null;
    }
    const { headerId, identifier, delimiter, arrayDelimiter } = headerItem;

    const { main: csvArray, isInclude } = csvStr
      .slice(identifier.length)
      .split(delimiter)
      .reduce(
        (result, cur) => {
          const { main, include, isInclude } = result;
          if (cur === arrayDelimiter) {
            return {
              main: isInclude ? [...main, include] : main,
              include: [],
              isInclude: !isInclude,
            };
          }
          return {
            main: isInclude ? main : [...main, cur],
            include: isInclude ? [...include, cur] : include,
            isInclude,
          };
        },
        { main: [], include: [], isInclude: false }
      );

    if (isInclude) {
      this.logger.warn(
        `The string does not match the array insertion format. Line number: ${lineNumber}. This line is ignored.`
      );
      return null;
    }

    const { main, isError } = headerItem.header.reduce(
      (result, item, index) => {
        const { main, isError } = result;
        const resItem =
          index < csvArray.length
            ? this.convStringToSpecType({
                value: csvArray[index],
                headerItem: item,
              })
            : null;
        if (Object.is(resItem, null)) {
          this.logger.warn(
            `Field values do not match type. Line number: ${lineNumber}. This line is ignored.`
          );
          return { main: { ...main, [item.name]: resItem }, isError: true };
        }

        return { main: { ...main, ...resItem }, isError };
      },
      { main: {}, isError: false }
    );

    return isError ? null : { headerId, ...main };
  }

  private divIncludedArray({
    csvs,
    headers,
  }: {
    csvs: any[];
    headers: IHeaderArrayItem[];
  }): any[] | null {
    if (!csvs.length || !headers.length || csvs.length % headers.length) {
      this.logger.warn(`The included array does not match the description.`);
      return null;
    }

    const { main: res } = csvs.reduce(
      (result, cur) => {
        result.include = {
          ...result.include,
          ...this.convStringToSpecType({
            value: cur,
            headerItem: headers[result.count],
          }),
        };
        result.count++;

        if (result.count == result.maxValue) {
          result.main.push(result.include);
          result.include = {};
          result.count = 0;
        }

        return result;
      },
      { main: [], include: {}, count: 0, maxValue: headers.length }
    );

    return res;
  }

  // преобразует данные в необходимый тип
  private convStringToSpecType({
    value,
    headerItem,
  }: {
    value: string | string[] | null;
    headerItem: IHeaderItem;
  }): any | any[] | null {
    const { name, type, header } = headerItem;

    if (Object.is(value, null)) {
      switch (type) {
        case typeFieldEnum.ARRAY:
          return [];
        case typeFieldEnum.NUMBER:
          return { [name]: 0 };
        case typeFieldEnum.STRING:
          return { [name]: '' };
        case typeFieldEnum.DATE:
          return { [name]: new Date() };
        default:
          return null;
      }
    }

    switch (type) {
      case typeFieldEnum.ARRAY:
        return !Array.isArray(value) || !header || !Array.isArray(header)
          ? this.convStringToSpecType({ value: null, headerItem })
          : { [name]: this.divIncludedArray({ csvs: value, headers: header }) };
      case typeFieldEnum.NUMBER:
        const resNumber =
          typeof value === 'string'
            ? Number(replaceComma(value))
            : this.convStringToSpecType({ value: null, headerItem });
        return { [name]: Object.is(resNumber, NaN) ? 0 : resNumber };
      case typeFieldEnum.STRING:
        return { [name]: value };
      case typeFieldEnum.DATE:
        const resDate =
          typeof value === 'string'
            ? new Date(value)
            : this.convStringToSpecType({ value: null, headerItem });
        return { [name]: !resDate ? new Date() : resDate };
      default:
        return null;
    }
  }
}
