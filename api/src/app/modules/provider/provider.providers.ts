import { ProviderEntity } from "./entities/provider.entity";
import { PROVIDER_REPOSITORY } from "../../../libs/constants/repositories/repo.constant";

export const providerProviders = [
  {
    provide: PROVIDER_REPOSITORY,
    useValue: ProviderEntity,
  },
];
