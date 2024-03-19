import { Make_Of_DebtEntity } from "./entities/make_of_debt.entity";
import { MAKE_OF_DEBT_REPOSITORY } from "../../../libs/constants/repositories/repo.constant";

export const make_of_debtProviders = [
  {
    provide: MAKE_OF_DEBT_REPOSITORY,
    useValue: Make_Of_DebtEntity,
  },
];
