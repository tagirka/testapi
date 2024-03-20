import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

//import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

import { SEQUELIZE } from '@webapi/libs/constants';
import {
  BASKET_ITEMS_REPOSITORY,
  BASKET_REPOSITORY,
} from '@webapi/libs/constants/repositories/repo.constant';

import {
  BasketItemsEntity,
  IBasketItemsCreationAttrs,
} from '../entities/basket_items.entity';
import { BasketEntity, IBasketCreationAttrs } from '../entities/basket.entity';

@Injectable()
export class BasketRepository {
  constructor(
    @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
    @Inject(BASKET_ITEMS_REPOSITORY)
    private readonly basketItemsRepository: typeof BasketItemsEntity,
    @Inject(BASKET_REPOSITORY)
    private readonly basketRepository: typeof BasketEntity,
    private readonly configService: ConfigService
  ) {}

  async createBasket({
    userId,
    totalSum,
    basketItems,
  }: {
    acquiringId: number;
    userId: number;
    totalSum: number;
    basketItems: {
      positionId: number;
      operationId: bigint;
      sum: number;
    }[];
  }): Promise<{ basketId: bigint; orderNumber: string }> {
    try {
      const basket = await this.sequelize.transaction(
        async (t: Transaction) => {
          const addBasket: IBasketCreationAttrs = {
            fk_user_id: userId,
            date_basket: new Date(),
            amount: totalSum,
          };

          const rowBasket = await this.basketRepository.create(addBasket, {
            transaction: t,
          });

          const addBasketItems: IBasketItemsCreationAttrs[] = basketItems.map(
            (item) => {
              return {
                fk_basket_id: rowBasket.id,
                fk_operation_id: item.operationId,
                positionId: item.positionId,
                sum: item.sum,
              };
            }
          );

          await this.basketItemsRepository.bulkCreate(addBasketItems, {
            transaction: t,
          });

          return { rowBasket, basketId: rowBasket.id };
        }
      );

      const { rowBasket, basketId } = basket;
      //FIX IT
      const node = this.configService.get('NODE_ENV');
      const prefix =
        !node || !node.length ? 'XX' : node.slice(0, 2).padStart(2, 'X');
      const orderNumber = `${prefix}${rowBasket.id
        .toString(10)
        .padStart(8, '0')}`;
      //FIX IT

      await rowBasket.update({ order_number: orderNumber });

      return { basketId, orderNumber };
    } catch (err) {
      throw new InternalServerErrorException(
        `Ошибка формирования новой корзины. Error: ${err}`
      );
    }
  }
}
