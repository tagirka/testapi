import { OperationEntity } from "./entities/operation.entity";
import { OPERATION_REPOSITORY } from "../../../libs/constants/repositories/repo.constant";

export const operationProviders = [
  {
    provide: OPERATION_REPOSITORY,
    useValue: OperationEntity,
  },
];
