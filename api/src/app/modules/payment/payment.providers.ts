import { PaymentEntity } from "./entities/payment.entity";
import { PAYMENT_REPOSITORY } from "../../../libs/constants/repositories/repo.constant";

export const paymentProviders = [
  {
    provide: PAYMENT_REPOSITORY,
    useValue: PaymentEntity,
  },
];
