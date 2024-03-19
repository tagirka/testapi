import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

import {
  IBasketItem,
  IOrderBundle,
  IJsonParams,
} from '@webapi/app/controllers/acquiring/types/request.types';
import { getUniqueArray } from '@webapi/libs/utils/helpers/array-options';

import { ElsEntity } from '@webapi/app/modules/els/entities/els.entity';
import { Make_Of_ServiceEntity } from '../make_of_service/entities/make_of_service.entity';
import { Make_Of_ServiceService } from '../make_of_service/make_of_service.service';
import { OperationRepository } from './operation.repository';
import { Operation_DetailsService } from './operation_details/operation_details.service';

@Injectable()
export class OperationService {
  constructor(
    private operationRepository: OperationRepository,
    private operation_detailsService: Operation_DetailsService,
    private make_of_serviceService: Make_Of_ServiceService
  ) {}

  async getBasket(
    acquiringId: number,
    basketItems: IBasketItem[]
  ): Promise<{
    jsonParams: IJsonParams;
    orderBundle: IOrderBundle;
  }> {
    const baskets = await Promise.all(
      basketItems.map(async (item) => {
        const { positionId, operationId: id, sum: itemAmount } = item;
        const { els, codeSus, nameUs } = await this.operationRepository.findOne(
          {
            where: { id },
            attributes: [],
            include: [
              {
                model: Make_Of_ServiceEntity,
                as: 'operation_service',
                attributes: ['code_sus', 'name_us'],
              },
              {
                model: ElsEntity,
                as: 'operation_els',
                attributes: ['els'],
              },
            ],
            //raw: true,
          },
          (res) => {
            const { operation_service: objService, operation_els: objEls } =
              res;

            if (!objService || !objEls)
              throw new InternalServerErrorException(`Ошибка данных.`);

            const { code_sus: codeSus, name_us: nameUs } = objService;
            const { els } = objEls;

            return {
              els,
              codeSus,
              nameUs,
            };
          }
        );

        return {
          els,
          basketItem: {
            positionId,
            name: nameUs,
            quantity: { value: 1, measure: 'шт' },
            itemAmount,
            itemCode: `${els}:${codeSus}`,
          },
        };
      })
    );

    if (!baskets.length)
      throw new InternalServerErrorException(
        `Ошибка данных. Массив нулевой длины.`
      );

    // const uniqueEls = getUniqueArray(baskets.map((item) => item.els));

    // if (uniqueEls.length !== 1)
    //   throw new BadRequestException('Ошибка данных. ЕЛС не уникален.');

    // const [els] = uniqueEls;

    const jsonParams = { uesEls: '7400000000' };

    const orderBundle = {
      cartItems: {
        items: baskets.map((item) => ({ ...item.basketItem })),
      },
    };

    return { jsonParams, orderBundle };
  }

  // async getBasket(basketItems): Promise<{
  //   jsonParams: { uesEls: string };
  //   orderBundle: {
  //     cartItems: {
  //       items: {
  //         positionId: number;
  //         name: string;
  //         quantity: { value: number; measure: string };
  //         itemAmount: number;
  //         itemCode: string;
  //       }[];
  //     };
  //   };
  // }> {
  //   const baskets = await Promise.all(
  //     basketItems.map(async (item) => {
  //       const { positionId, operationId: id, sum: itemAmount } = item;
  //       console.log(positionId, id, itemAmount);
  //       const { els, codeSus, nameUs } = await this.operationRepository.findOne(
  //         {
  //           where: { id },
  //           attributes: [],
  //           include: [
  //             {
  //               model: Make_Of_ServiceEntity,
  //               as: 'operation_service',
  //               attributes: ['code_sus', 'name_us'],
  //             },
  //             {
  //               model: ElsEntity,
  //               as: 'operation_els',
  //               attributes: ['els'],
  //             },
  //           ],
  //           //raw: true,
  //         },
  //         (res) => {
  //           const { operation_service: objService, operation_els: objEls } =
  //             res;

  //           if (!objService || !objEls)
  //             throw new InternalServerErrorException(`Ошибка данных.`);

  //           const { code_sus: codeSus, name_us: nameUs } = objService;
  //           const { els } = objEls;

  //           return {
  //             els,
  //             codeSus,
  //             nameUs,
  //           };
  //         }
  //       );

  //       return {
  //         els,
  //         basketItem: {
  //           positionId,
  //           name: nameUs,
  //           quantity: { value: 1, measure: 'шт' },
  //           itemAmount,
  //           itemCode: codeSus,
  //         },
  //       };
  //     })
  //   );

  //   if (!baskets.length)
  //     throw new InternalServerErrorException(
  //       `Ошибка данных. Массив нулевой длины.`
  //     );

  //   const uniqueEls = getUniqueArray(baskets.map((item) => item.els));

  //   if (uniqueEls.length !== 1)
  //     throw new BadRequestException('Ошибка данных. ЕЛС не уникален.');

  //   const [els] = uniqueEls;

  //   const jsonParams = { uesEls: els };

  //   const orderBundle = {
  //     cartItems: { items: baskets.map((item) => ({ ...item.basketItem })) },
  //   };

  //   return { jsonParams, orderBundle };
  // }
}
