import { MeasureEntity } from "./entities/measure.entity";
import { MEASURE_REPOSITORY } from "../../../libs/constants/repositories/repo.constant";

export const measureProviders = [
  {
    provide: MEASURE_REPOSITORY,
    useValue: MeasureEntity,
  },
];
