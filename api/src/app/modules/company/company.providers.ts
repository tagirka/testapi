import { CompanyEntity } from "./entities/company.entity";
import { COMPANY_REPOSITORY } from "../../../libs/constants/repositories/repo.constant";

export const companyProviders = [
  {
    provide: COMPANY_REPOSITORY,
    useValue: CompanyEntity,
  },
];
