import { Meters_DataEntity } from './entities/meters_data.entity';
import { METERS_DATA_REPOSITORY } from '../../../libs/constants/repositories/repo.constant';

export const meters_dataProviders = [
  {
    provide: METERS_DATA_REPOSITORY,
    useValue: Meters_DataEntity,
  },
];
