import { MD_FROM_BP_REPOSITORY } from '@webapi/libs/constants';
import { MD_From_BPEntity } from './entities/md_from_bp.entity';

export const md_from_bpProviders = [
  {
    provide: MD_FROM_BP_REPOSITORY,
    useValue: MD_From_BPEntity,
  },
];
