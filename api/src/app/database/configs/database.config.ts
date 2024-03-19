import { ConfigService, ConfigModule } from '@nestjs/config';
import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeOptions } from 'sequelize-typescript';
import { getModel } from '../database.providers';
import { SEQUELIZE } from '@webapi/libs/constants';
import { IDatabaseConfigAttributes } from '../interfaces/dbconfig.interface';
import { Logger } from '@nestjs/common';

// dotenv.config();

// export const databaseConfig: IDatabaseConfig = {
//   development: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME_DEVELOPMENT,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: process.env.DB_DIALECT,
//     logging: false,
//   },
//   test: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME_TEST,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: process.env.DB_DIALECT,
//     logging: false,
//   },
//   production: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME_PRODUCTION,
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT,
//     logging: false,
//   },
// };

const getConfig = (
  configService: ConfigService
): IDatabaseConfigAttributes => ({
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  dialect: <Dialect>configService.get('DB_DIALECT') || 'postgres',
  logging: false,
});

export const getDataBaseConfig = (models: typeof getModel) => {
  const logger = new Logger('DB');

  return {
    inject: [ConfigService],
    imports: [ConfigModule],
    provide: SEQUELIZE,
    useFactory: async (configService: ConfigService) => {
      const config: SequelizeOptions = getConfig(configService);

      logger.log(`${config.host}:${config.port}:${config.database}`);

      const sequelize = new Sequelize(config);
      sequelize.addModels(models);
      await sequelize.sync();
      return sequelize;
    },
  };
};
