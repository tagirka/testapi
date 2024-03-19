import { TariffEntity } from "./entities/tariff.entity";
import { TARIFF_REPOSITORY } from "../../../libs/constants/repositories/repo.constant";

export const tariffProviders = [
  {
    provide: TARIFF_REPOSITORY,
    useValue: TariffEntity,
  },
];
