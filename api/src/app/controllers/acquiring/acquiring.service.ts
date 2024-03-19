import {
  Injectable,
  //BadRequestException,
  //NotFoundException,
  //ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as https from 'https';
import * as crypto from 'crypto';
import { HttpService } from '@nestjs/axios';

import {
  UES_CONTROLLER_ACQUIRING_STATUS,
  UES_VBRR_CURRENCY,
  UES_VBRR_LANGUAGE,
} from '@webapi/libs/constants/runtime/exception.constant';
import {
  ISession,
  AcquiringEnum,
  IParamAcquiring,
} from './types/request.types';
import { IAcquiringStart, IAcquiringStatus } from './types/response.types';
import { StatusSessionDto } from './dtos/status_session.dto';

import { AcquiringRepository } from './repositories/acquiring.repository';
//import { ElsEntity } from '@webapi/app/modules/els/entities/els.entity';
//import { Make_Of_ServiceEntity } from '@webapi/app/modules/make_of_service/entities/make_of_service.entity';
import { BasketRepository } from './repositories/basket.repository';
import { OperationService } from '@webapi/app/modules/operation/operation.service';
//import { OperationRepository } from '@webapi/app/modules/operation/operation.repository';

@Injectable()
export class AcquiringService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly acquiringRepository: AcquiringRepository,
    private readonly basketRepository: BasketRepository,
    private readonly operationService: OperationService //private readonly operationRepository: OperationRepository
  ) {}

  async startSession(
    paramSession: ISession
  ): Promise<IAcquiringStart | string> {
    const { acquiringId } = paramSession;
    try {
      const paramAcquiring = await this.acquiringRepository.findAcquiring(
        acquiringId
      );

      const { basketId, orderNumber, amount, jsonParams, orderBundle } =
        await this.createBasket(paramSession);

      const { orderId, formUrl } = await this.requestByStartSession({
        paramAcquiring,
        paramSession: {
          ...paramSession,
          basketId,
          orderNumber,
          amount,
          jsonParams,
          orderBundle,
        },
      });

      return { orderId, formUrl };
    } catch (err) {
      if (err.name === 'Error')
        throw new InternalServerErrorException(`Error acquiring.`); //${err.message}
      throw err;
    }
  }

  async createBasket(paramSession: ISession): Promise<ISession> {
    const { acquiringId, userId, totalSum, basketItems } = paramSession;
    const { basketId, orderNumber } = await this.basketRepository.createBasket({
      acquiringId,
      userId,
      totalSum,
      basketItems,
    });

    const { jsonParams, orderBundle } = await this.operationService.getBasket(
      acquiringId,
      basketItems
    );

    return {
      ...paramSession,
      basketId,
      orderNumber,
      amount: totalSum,
      jsonParams,
      orderBundle,
    };
  }

  async requestByStartSession({
    paramAcquiring,
    paramSession,
  }: {
    paramAcquiring: IParamAcquiring;
    paramSession: ISession;
  }): Promise<IAcquiringStart> {
    const {
      acquiringId,
      urlStartSession: url,
      login,
      password,
    } = paramAcquiring;

    if (!url || !login || !password)
      throw new Error('Отсутствуют значения параметров эквайринга.'); //NotFoundException

    const {
      baseUrl,
      userId,
      phone,
      basketId,
      orderNumber,
      amount,
      jsonParams,
      orderBundle,
    } = paramSession;

    const returnUrl = this.createHashUrl({
      baseUrl,
      controller: UES_CONTROLLER_ACQUIRING_STATUS,
      strForHash: `${orderNumber}${Date.now()}${acquiringId}1`,
    });
    const failUrl = this.createHashUrl({
      baseUrl,
      controller: UES_CONTROLLER_ACQUIRING_STATUS,
      strForHash: `${orderNumber}${Date.now()}${acquiringId}0`,
    });

    const req = new URLSearchParams();
    req.append('userName', login);
    req.append('password', password);
    req.append('amount', amount.toString(10));
    req.append('currency', UES_VBRR_CURRENCY.toString(10));
    req.append('orderNumber', orderNumber);
    req.append('returnUrl', returnUrl);
    req.append('failUrl', failUrl);

    req.append(
      'jsonParams',
      JSON.stringify(
        acquiringId === AcquiringEnum.SB_PAY
          ? { ...jsonParams, back2app: true, phone }
          : jsonParams
      )
    );

    if (acquiringId === AcquiringEnum.VBRR)
      req.append('orderBundle', JSON.stringify(orderBundle));

    const resSession = await this.session({
      url,
      req: req.toString(),
    });

    const { orderId, formUrl, errorCode, errorMessage } = resSession;

    if (!orderId || !formUrl)
      throw new Error(
        !errorCode || !errorMessage
          ? 'Ошибка эквайринга.'
          : `[${errorCode}] ${errorMessage}`
      );

    const resBankSession = await this.acquiringRepository.createBankSession({
      fk_acquiring_id: acquiringId,
      fk_user_id: userId,
      fk_basket_id: basketId,
      date_order: new Date(),
      amount,
      url_forward: returnUrl,
      url_error: failUrl,
      url_payment: formUrl,
      order_id: orderId,
    });

    if (!resBankSession) throw new Error('Ошибка записи BankSession.');

    return { orderId, formUrl, errorCode, errorMessage };
  }

  async statusSession({
    hash,
  }: {
    hash: string;
  }): Promise<{ isPay: boolean; orderId: string }> {
    const { sessionId, acquiringId, orderId, urlError } =
      await this.acquiringRepository.findSession(hash);

    if (!sessionId) throw new Error(`Некорректная ссылка.`);
    // BadRequestException
    const paramAcquiring = await this.acquiringRepository.findAcquiring(
      acquiringId
    );

    const {
      errorCode = 1,
      orderStatus = 0,
      actionCode,
      ip = 'Нет данных',
    } = await this.requestByStatusSession({ paramAcquiring, orderId });

    if (typeof actionCode === 'undefined') return { isPay: false, orderId };

    await this.acquiringRepository.updateSession({
      id: sessionId,
      updateRow: urlError.includes(hash)
        ? { status: orderStatus }
        : {
            error_code: errorCode,
            status: orderStatus,
            action_code: actionCode,
            user_ip: ip,
          },
    });

    return { isPay: !actionCode, orderId };
  }

  async requestByStatusSession({
    paramAcquiring,
    orderId,
  }: {
    paramAcquiring: IParamAcquiring;
    orderId: string;
  }): Promise<IAcquiringStatus> {
    const { urlStatusSession: url, login, password } = paramAcquiring;

    if (!url || !login || !password)
      throw new Error('Отсутствуют значения параметров эквайринга.');
    // NotFoundException
    const req = new URLSearchParams();

    req.append('orderId', orderId);
    req.append('language', UES_VBRR_LANGUAGE);
    req.append('userName', login);
    req.append('password', password);

    return await this.session({ url, req: req.toString() });
  }

  private async session({
    url,
    req,
  }: {
    url: string;
    req: string;
  }): Promise<any> {
    return await this.httpService.axiosRef
      .post(url, req, {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(`Ошибка запроса к эквайрингу: [${err}].`); // ServiceUnavailableException
      });
  }

  async statusSessionByOrderId({
    acquiringId,
    orderId,
  }: StatusSessionDto): Promise<{ isPay: boolean; orderId: string }> {
    const { sessionId } = await this.acquiringRepository.findSessionByOrderId({
      acquiringId,
      orderId,
    });
    console.log(acquiringId, '#', orderId, '#', sessionId);
    if (!sessionId) throw new Error(`Некорректная ссылка.`);

    const paramAcquiring = await this.acquiringRepository.findAcquiring(
      acquiringId
    );

    const {
      errorCode = 1,
      orderStatus = 0,
      actionCode,
      ip = 'Нет данных',
    } = await this.requestByStatusSession({ paramAcquiring, orderId });

    if (typeof actionCode === 'undefined') return { isPay: false, orderId };

    await this.acquiringRepository.updateSession({
      id: sessionId,
      updateRow: {
        error_code: errorCode,
        status: orderStatus,
        action_code: actionCode,
        user_ip: ip,
      },
    });

    return { isPay: !actionCode, orderId };
  }

  private createHashUrl({
    baseUrl,
    controller,
    strForHash,
    createHash = true,
  }: {
    baseUrl: string;
    controller: string;
    strForHash: string;
    createHash?: boolean;
  }): string {
    const urlCheck = `http://${baseUrl}${
      baseUrl[baseUrl.length - 1] === '/' ? '' : '/'
    }`;

    const hash = createHash
      ? crypto.createHash('md5').update(strForHash).digest('hex')
      : strForHash;

    const url = new URL(`${controller}/${hash}`, urlCheck);

    return url.href;
  }
}
