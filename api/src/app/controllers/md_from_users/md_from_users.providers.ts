import { MD_FROM_USERS_REPOSITORY } from 'src/libs/constants';
import { MD_From_UsersEntity } from './entities/md_from_users.entity';

export const md_from_usersProviders = [
  {
    provide: MD_FROM_USERS_REPOSITORY,
    useValue: MD_From_UsersEntity,
  },
];
