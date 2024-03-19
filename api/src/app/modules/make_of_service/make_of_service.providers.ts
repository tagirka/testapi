import { Make_Of_ServiceEntity } from "./entities/make_of_service.entity";
import { MAKE_OF_SERVICE_REPOSITORY } from "../../../libs/constants/repositories/repo.constant";

export const make_of_serviceProviders = [
  {
    provide: MAKE_OF_SERVICE_REPOSITORY,
    useValue: Make_Of_ServiceEntity,
  },
];
