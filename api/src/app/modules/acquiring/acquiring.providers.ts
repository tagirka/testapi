import {
  ACQUIRING_REPOSITORY,
  BANK_SESSIONS_REPOSITORY,
  BASKET_ITEMS_REPOSITORY,
  BASKET_REPOSITORY,
} from '@webapi/libs/constants/repositories/repo.constant';

import { AcquiringEntity } from './entities/acquiring.entity';
import { BankSessionsEntity } from './entities/bank_sessions.entity';
import { BasketItemsEntity } from './entities/basket_items.entity';
import { BasketEntity } from './entities/basket.entity';

export const acquiringProviders = [
  {
    provide: ACQUIRING_REPOSITORY,
    useValue: AcquiringEntity,
  },
  {
    provide: BANK_SESSIONS_REPOSITORY,
    useValue: BankSessionsEntity,
  },
  {
    provide: BASKET_ITEMS_REPOSITORY,
    useValue: BasketItemsEntity,
  },
  {
    provide: BASKET_REPOSITORY,
    useValue: BasketEntity,
  },
];
