import { getDataBaseConfig } from './configs/database.config';

import { AccountEntity } from '../modules/account/entities/account.entity';
import { AcquiringEntity } from '@webapi/app/controllers/acquiring/entities/acquiring.entity';
import { BankSessionsEntity } from '@webapi/app/controllers/acquiring/entities/bank_sessions.entity';
import { BasketItemsEntity } from '@webapi/app/controllers/acquiring/entities/basket_items.entity';
import { BasketEntity } from '@webapi/app/controllers/acquiring/entities/basket.entity';
import { BuildEntity } from '../modules/els/entities/build.entity';
import { CompanyEntity } from '../modules/company/entities/company.entity';
import { ElsEntity } from '../modules/els/entities/els.entity';
import { MD_From_BPEntity } from '../controllers/md_from_bp/entities/md_from_bp.entity';
import { MD_From_UsersEntity } from '../controllers/md_from_users/entities/md_from_users.entity';
import { MeasureEntity } from '../modules/measure/entities/measure.entity';
import { Meters_DataEntity } from '../modules/meters_data/entities/meters_data.entity';
import { NamingEntity } from '../modules/els/entities/naming.entity';
import { OperationEntity } from '../modules/operation/entities/operation.entity';
import { Operation_DetailsEntity } from '../modules/operation/operation_details/entities/operation_details.entity';
import { PaymentEntity } from '../modules/payment/entities/payment.entity';
import { ProviderEntity } from '../modules/provider/entities/provider.entity';
import { RoleEntity } from '../controllers/auth/role/entities/role.entity';
import { SN_Of_MeterEntity } from '../modules/sn_of_meter/entities/sn_of_meter.entity';
import { TariffEntity } from '../modules/tariff/entities/tariff.entity';
import { Make_Of_DebtEntity } from '../modules/make_of_debt/entities/make_of_debt.entity';
import { Make_Of_PaymentEntity } from '../modules/make_of_payment/entities/make_of_payment.entity';
import { Make_Of_MeterEntity } from '../modules/make_of_meter/entities/make_of_meter.entity';
import { Make_Of_ServiceEntity } from '../modules/make_of_service/entities/make_of_service.entity';
import { UserModel } from '../controllers/auth/user/models/user.model';
import { UserElsModel } from '../controllers/auth/user/models/user-els.model';
import { VerifyModel } from '../controllers/auth/verify/models/verify.model';
import { ProfileModel } from '../admin/profile/models/profile.model';

export const getModel = [
  AccountEntity,
  AcquiringEntity,
  BankSessionsEntity,
  BasketItemsEntity,
  BasketEntity,
  BuildEntity,
  CompanyEntity,
  ElsEntity,
  MD_From_BPEntity,
  MD_From_UsersEntity,
  MeasureEntity,
  Meters_DataEntity,
  NamingEntity,
  OperationEntity,
  Operation_DetailsEntity,
  PaymentEntity,
  ProviderEntity,
  RoleEntity,
  SN_Of_MeterEntity,
  TariffEntity,
  Make_Of_DebtEntity,
  Make_Of_MeterEntity,
  Make_Of_PaymentEntity,
  Make_Of_ServiceEntity,
  UserModel,
  UserElsModel,
  VerifyModel,
  ProfileModel,
];

export const databaseProvider = getDataBaseConfig(getModel);

// export const databaseProviders = [
//   {
//     provide: SEQUELIZE,
//     useFactory: async () => {
//       let config;

//       switch (process.env.NODE_ENV) {
//         case DEVELOPMENT:
//           config = databaseConfig.development;
//           break;
//         case TEST:
//           config = databaseConfig.test;
//           break;
//         case PRODUCTION:
//           config = databaseConfig.production;
//           break;
//         default:
//           config = databaseConfig.development;
//       }

//       const sequelize = new Sequelize(config);
//       sequelize.addModels([
//         AccountEntity,
//         AuthEntity,
//         BuildEntity,
//         CompanyEntity,
//         ElsEntity,
//         ExchangeEntity,
//         FiasEntity,
//         IdentificationEntity,
//         MD_From_UsersEntity,
//         MeasureEntity,
//         Meters_DataEntity,
//         OperationEntity,
//         Operation_DetailsEntity,
//         PaymentEntity,
//         ProviderEntity,
//         SN_Of_MeterEntity,
//         TariffEntity,
//         Make_Of_DebtEntity,
//         Make_Of_MeterEntity,
//         Make_Of_PaymentEntity,
//         Make_Of_ServiceEntity,
//         UserEntity,
//         User_PropertyEntity,
//       ]);
//       await sequelize.sync();
//       return sequelize;
//     },
//   },
// ];
