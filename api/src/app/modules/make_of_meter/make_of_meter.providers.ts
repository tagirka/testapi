import { Make_Of_MeterEntity } from "./entities/make_of_meter.entity";
import { MAKE_OF_METER_REPOSITORY } from "../../../libs/constants/repositories/repo.constant";

export const make_of_meterProviders = [
  {
    provide: MAKE_OF_METER_REPOSITORY,
    useValue: Make_Of_MeterEntity,
  },
];
