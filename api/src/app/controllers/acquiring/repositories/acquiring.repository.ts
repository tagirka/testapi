import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

import { SEQUELIZE } from '@webapi/libs/constants';
import { AcquiringEnum } from '../types/request.types';
import {
  ACQUIRING_REPOSITORY,
  BANK_SESSIONS_REPOSITORY,
} from '@webapi/libs/constants/repositories/repo.constant';

import { AcquiringEntity } from '../entities/acquiring.entity';
import {
  BankSessionsEntity,
  IBankSessionsCreationAttrs,
  IBankSessionsUpdateAttrs,
} from '../entities/bank_sessions.entity';

@Injectable()
export class AcquiringRepository {
  constructor(
    @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
    @Inject(ACQUIRING_REPOSITORY)
    private readonly acquiringRepository: typeof AcquiringEntity,
    @Inject(BANK_SESSIONS_REPOSITORY)
    private readonly bankSessionsRepository: typeof BankSessionsEntity,
    private readonly configService: ConfigService
  ) {}

  async createBankSession(
    addRow: IBankSessionsCreationAttrs
  ): Promise<BankSessionsEntity> {
    try {
      return await this.sequelize.transaction(async (t: Transaction) => {
        return await this.bankSessionsRepository.create(addRow, {
          transaction: t,
        });
      });
    } catch (err) {
      throw new InternalServerErrorException(
        `Ошибка формирования новой записи. Error: ${err}`
      );
    }
  }

  async findSession(url: string): Promise<{
    sessionId: bigint;
    acquiringId: number;
    orderId: string;
    urlForward: string;
    urlError: string;
  }> {
    return await this.bankSessionsRepository
      .findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { url_forward: { [Op.like]: `%${url}` } },
                { url_error: { [Op.like]: `%${url}` } },
              ],
            },
            {
              status: {
                [Op.is]: null,
              },
            },
          ],
        },
      })
      .then((res) => {
        if (!res)
          return {
            sessionId: BigInt(0),
            acquiringId: 0,
            orderId: '',
            urlForward: '',
            urlError: '',
          };
        const {
          id: sessionId,
          fk_acquiring_id: acquiringId,
          order_id: orderId,
          url_forward: urlForward,
          url_error: urlError,
        } = res;
        return {
          sessionId,
          acquiringId,
          orderId,
          urlForward,
          urlError,
        };
      })
      .catch((err) => {
        throw new InternalServerErrorException(
          `Ошибка поиска сессии: [${err}].`
        );
      });
  }

  async findSessionByOrderId({
    acquiringId,
    orderId,
  }: {
    acquiringId: AcquiringEnum;
    orderId: string;
  }): Promise<{
    sessionId: bigint | null;
  }> {
    return await this.bankSessionsRepository
      .findOne({
        where: {
          [Op.and]: [
            { fk_acquiring_id: { [Op.eq]: acquiringId } },
            { order_id: { [Op.eq]: orderId } },
          ],
        },
      })
      .then((res) => {
        return { sessionId: !res ? null : res.id };
      })
      .catch((err) => {
        throw new InternalServerErrorException(
          `Ошибка поиска сессии: [${err}].`
        );
      });
  }

  async findAcquiring(id: number): Promise<{
    acquiringId: number;
    urlStartSession: string;
    urlStatusSession: string;
    login: string;
    password: string;
  }> {
    return await this.acquiringRepository
      .findOne({
        where: { id },
      })
      .then((res) => {
        if (!res) throw new Error(`Ошибка данных эквайринга.`);
        //InternalServerErrorException
        const {
          id: acquiringId,
          url_start_session: urlStartSession,
          url_status_session: urlStatusSession,
          login,
          password,
        } = res;
        return {
          acquiringId,
          urlStartSession,
          urlStatusSession,
          login,
          password,
        };
      })
      .catch((err) => {
        throw new Error(
          `Ошибка поиска эквайринга: [${err}].`
          //InternalServerErrorException
        );
      });
  }

  async findNotCompletedSession(): Promise<
    {
      sessionId: bigint;
      acquiringId: number;
      orderId: string;
      urlForward: string;
      urlError: string;
    }[]
  > {
    return await this.bankSessionsRepository
      .findAll({
        where: {
          [Op.or]: [{ status: { [Op.is]: null } }, { status: { [Op.eq]: 0 } }],
        },
      })
      .then((res) => {
        if (!res || !Array.isArray(res))
          throw new InternalServerErrorException(
            `Ошибка данных при поиске сессии.`
          );
        return res.map((item) => {
          const {
            id: sessionId,
            fk_acquiring_id: acquiringId,
            order_id: orderId,
            url_forward: urlForward,
            url_error: urlError,
          } = item;
          return { sessionId, acquiringId, orderId, urlForward, urlError };
        });
      })
      .catch((err) => {
        throw new InternalServerErrorException(
          `Ошибка поиска сессии: [${err}].`
        );
      });
  }

  async updateSession({
    id,
    updateRow,
  }: {
    id: bigint;
    updateRow: IBankSessionsUpdateAttrs;
  }) {
    await this.bankSessionsRepository
      .update<BankSessionsEntity>(updateRow, {
        where: { id },
      })
      .then((res) => res)
      .catch((err) => {
        throw new InternalServerErrorException(
          `Ошибка поиска сессии: [${err}].`
        );
      });
  }
}
