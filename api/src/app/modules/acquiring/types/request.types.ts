import { StartSessionDto } from '../dtos/start_session.dto';

export const enum AcquiringEnum {
  VBRR = 1,
  SB = 2,
  SB_PAY = 3,
}
export interface ISession extends StartSessionDto {
  userId: number;
  basketId?: bigint;
  orderNumber?: string;
  amount?: number;
  jsonParams?: IJsonParams;
  orderBundle?: IOrderBundle;
}

export interface IParamAcquiring {
  acquiringId?: number;
  urlStartSession?: string;
  urlStatusSession?: string;
  login: string;
  password: string;
}

export interface IJsonParams {
  uesEls: string;
}

export interface IOrderBundle {
  cartItems?: ICartItems;
}

interface ICartItems {
  items: {
    positionId: number;
    name: string;
    quantity: { value: number; measure: string };
    itemAmount: number;
    itemCode: string;
  }[];
}

export interface IBasketItem {
  positionId: number;
  operationId: bigint;
  sum: number;
}
