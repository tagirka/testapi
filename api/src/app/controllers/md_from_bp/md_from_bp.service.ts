import {
  Inject,
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import * as https from 'https';
import { XMLParser } from 'fast-xml-parser';

import { UES_INTERNAL_SERVER_ERROR } from '@webapi/libs/constants/runtime/exception.constant';

import { dateStrToTS, parseIntOrZero, billingDate } from '../../../libs/utils';

import {
  MD_From_BPEntity,
  Imd_from_bpCreationAttrs,
} from './entities/md_from_bp.entity';
import { Make_Of_ServiceService } from '../../modules/make_of_service/make_of_service.service';
import { MD_FROM_BP_REPOSITORY } from '@webapi/libs/constants';
import { ElsRepository } from '@webapi/app/modules/els/repositories/els.repository';
import { IApiDBtoDB } from '@webapi/libs/interfaces';

export interface Ibp_ipuCreationAttrs {
  _id: string;
  _guid: string;
  _sname: string;
  _dlind: string;
  _nlind: string;
  _dpind: string;
  _npind: string;
  _dnind: string;
  _nnind: string;
  _sid: string;
  _per: string;
  _snum: string;
  _dexp: string;
  _place: string;
  _idtu: string;
  _mnum: string;
  _meas: string;
}

const endBodyMsg = '...';
const limitBodyMsg = 1000;

@Injectable()
export class MD_From_BPService {
  constructor(
    @Inject(MD_FROM_BP_REPOSITORY)
    private md_from_bpRepository: typeof MD_From_BPEntity,
    private elsRepository: ElsRepository,
    private make_of_serviceService: Make_Of_ServiceService,
    private configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  async getMeters_Data_From_BP(els: string): Promise<IApiDBtoDB> {
    //const resReDirectBalance = await this.reDirectBalance({ els });
    const resReDirectBalance = await this.reDirectBalance({ els });

    if (!resReDirectBalance.status) {
      return resReDirectBalance;
    }

    const resTransformJsonToArray = this.transformJsonToArray({
      _guid: resReDirectBalance.res.RSP.GUID,
      ...resReDirectBalance.res.RSP.RESULT.IPU.ACC,
    });

    if (!resTransformJsonToArray.status) {
      return resTransformJsonToArray;
    }

    const resСonvertingToMD_From_BP = await this.convertingToMD_From_BP(
      resTransformJsonToArray.rows
    );

    return resСonvertingToMD_From_BP;
  }

  async reDirectBalance(params: { els: string }): Promise<IApiDBtoDB> {
    const url = this.configService.get('BP_URL_GETBALANCE');
    const username = this.configService.get('BP_USER');
    const password = this.configService.get('BP_PASS');

    if (!url || !username || !password)
      throw new NotFoundException('Отсутствуют значения констант .env .');

    return await this.httpService.axiosRef
      .get(url, {
        params,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
        responseType: 'text',
        auth: {
          username,
          password,
        },
      })
      .then((response) => {
        const res = this.parseXML(response.data);
        return { res, err: null, status: true };
      })
      .catch(() => {
        throw new InternalServerErrorException(UES_INTERNAL_SERVER_ERROR);
      });
  }

  private parseXML(xmlDataStr: string): object {
    const alwaysArray = [
      'RSP.RESULT.IPU.ACC.APU',
      'RSP.RESULT.IPU.ACC.APU.APUSC',
    ];

    const options = {
      ignoreAttributes: false,
      attributeNamePrefix: '_',
      ignoreDeclaration: true,
      isArray: (name, jpath) => {
        if (alwaysArray.indexOf(jpath) !== -1) return true;
      },
    };

    const parser = new XMLParser(options);
    const jsonObj = parser.parse(xmlDataStr);

    return jsonObj;
  }

  private transformJsonToArray(json: any): IApiDBtoDB {
    if (Object.is(json._guid, undefined)) {
      return {
        res: null,
        err: `В JSON (XML) отсутствует GUID.`,
        status: false,
      };
    }

    if (Object.is(json._id, undefined)) {
      return {
        res: null,
        err: `В JSON (XML) отсутствует ELS.`,
        status: false,
      };
    }

    if (!Array.isArray(json.APU)) {
      return {
        res: null,
        err: `Не верный JSON (XML) ELS = [${json._id}]. Отсутствует массив данных в секции [APU]`,
        status: false,
      };
    }

    const { APU, ...addMainJson } = json;
    const resultRows = [];

    APU.forEach((item) => {
      const { APUSC, ...addItemJson } = item;

      if (Array.isArray(APUSC)) {
        resultRows.push(
          ...APUSC.map((part) => {
            return {
              ...addMainJson,
              ...part,
              ...addItemJson,
            };
          })
        );
      } else {
        resultRows.push({
          ...addMainJson,
          ...APUSC,
          ...addItemJson,
        });
      }
    });

    return {
      res: null,
      err: null,
      status: true,
      rows: resultRows,
    };
  }

  async convertingToMD_From_BP(
    rows: Ibp_ipuCreationAttrs[]
  ): Promise<IApiDBtoDB> {
    let fullMsg = '';
    const result = [];

    for (const item of rows) {
      const { bodyMsg, row } = await this.rowFormation(item);
      fullMsg += bodyMsg;
      result.push(row);
    }

    return await this.md_from_bpRepository
      .bulkCreate(result)
      .then((res) => ({
        res: `Завершена обработка ${res.length} строк.`,
        err: fullMsg,
        status: true,
        rows: res,
      }))
      .catch(() => ({
        res: null,
        err: `Ошибка записи в таблицу "md_from_users". ` + fullMsg,
        status: false,
        //rows: res,
      }));
  }

  private async rowFormation(ipu: Ibp_ipuCreationAttrs): Promise<{
    bodyMsg: string;
    row: Imd_from_bpCreationAttrs;
  }> {
    let bodyMsg = '';

    const { id: els_id } = await this.elsRepository.findOne({ els: ipu._id });

    if (Object.is(els_id, null)) {
      bodyMsg = this.addBodyLog(
        bodyMsg,
        `Не найден ЕЛС в таблице "els"- BP.IPU._id [${ipu._id}] => els.els`
      );
    }

    const service_id = await this.make_of_serviceService.findServiceIdByCode(
      ipu._sid
    );

    if (Object.is(service_id, null)) {
      bodyMsg = this.addBodyLog(
        bodyMsg,
        `Не найдено соответствия по типу сервиса в таблице "service"- BP.IPU._sid [${ipu._sid}] => service.code_sus`
      );
    }

    const { billing_year, billing_month } = billingDate(ipu._per);

    return {
      bodyMsg,
      row: {
        els_id,
        service_id,
        guid: ipu._guid,
        exid: null,
        dlind: dateStrToTS(ipu._dlind),
        nlind: parseIntOrZero(ipu._nlind),
        dpind: dateStrToTS(ipu._dpind),
        npind: parseIntOrZero(ipu._npind),
        dnind: dateStrToTS(ipu._dnind),
        nnind: parseIntOrZero(ipu._nnind),
        snum: ipu._snum,
        place: ipu._place,
        idtu: ipu._idtu,
        mnum: ipu._mnum,
        sname: ipu._sname,
        billing_year,
        billing_month,
        exchange_code: null,
      },
    };
  }

  private addBodyLog(
    msg_body: string,
    msg: string,
    tfPrint = true,
    limit = limitBodyMsg
  ): string {
    if (tfPrint) {
      Logger.log(msg);
    }
    if (msg_body.length == limit) {
      return msg_body;
    }

    if ((msg_body + endBodyMsg).length < limit) {
      msg_body = msg_body + `\n` + msg;
    }

    if (msg_body.length >= limit - endBodyMsg.length) {
      return msg_body.slice(0, limit - endBodyMsg.length) + endBodyMsg;
    }

    return msg_body;
  }
}
