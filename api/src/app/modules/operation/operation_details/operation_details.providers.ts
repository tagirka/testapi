import { Operation_DetailsEntity } from "./entities/operation_details.entity";
import { OPERATION_DETAILS_REPOSITORY } from "../../../../libs/constants/repositories/repo.constant";

export const operation_detailsProviders = [
  {
    provide: OPERATION_DETAILS_REPOSITORY,
    useValue: Operation_DetailsEntity,
  },
];
