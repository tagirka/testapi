import { Make_Of_PaymentEntity } from "./entities/make_of_payment.entity";
import { MAKE_OF_PAYMENT_REPOSITORY } from "../../../libs/constants/repositories/repo.constant";

export const make_of_paymentProviders = [
  {
    provide: MAKE_OF_PAYMENT_REPOSITORY,
    useValue: Make_Of_PaymentEntity,
  },
];
