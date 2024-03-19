import { AccountEntity } from './entities/account.entity';
import { ACCOUNT_REPOSITORY } from '../../../libs/constants/repositories/repo.constant';

export const accountProviders = [
  {
    provide: ACCOUNT_REPOSITORY,
    useValue: AccountEntity,
  },
];
