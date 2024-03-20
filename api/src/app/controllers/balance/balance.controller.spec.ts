import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceModule } from '../../modules/balance/balance.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@webapi/app/database/database.module';
import { INestApplication } from '@nestjs/common';

describe('BalanceController', () => {
  let app: INestApplication;

  let controller: BalanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: 'envs/.webapi.env',
        }),
        DatabaseModule,
        BalanceModule,
      ],
      controllers: [BalanceController],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    controller = module.get<BalanceController>(BalanceController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
