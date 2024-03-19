import { ElsEntity } from "./entities/els.entity";
import { ELS_REPOSITORY } from "../../../libs/constants/repositories/repo.constant";

export const elsProviders = [
  {
    provide: ELS_REPOSITORY,
    useValue: ElsEntity,
  },
];
