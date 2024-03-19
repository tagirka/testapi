import { SN_Of_MeterEntity } from "./entities/sn_of_meter.entity";
import { SN_OF_METER_REPOSITORY } from "../../../libs/constants/repositories/repo.constant";

export const sn_of_meterProviders = [
  {
    provide: SN_OF_METER_REPOSITORY,
    useValue: SN_Of_MeterEntity,
  },
];
