import { TestingModule, Test } from '@nestjs/testing';

import { BalanceService } from './balance.service';
import { AccountModule } from 'src/app/modules/account/account.module';
import { ElsModule } from 'src/app/modules/els/els.module';

describe('BalanceService', () => {
  let service: BalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ElsModule, AccountModule],
      providers: [BalanceService],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
  });

  it('should be difined', () => {
    expect(service).toBeDefined();
  });

  // describe('test Point', () => {
  //   it('get array', () => {
  //     const result = service.getData();
  //     expect(result).toBeInstanceOf(Array);
  //   });
  // });

  describe('balance service defined', () => {
    // it('get operation by id', () => {
    //   const data = {
    //     els: '7401904221',
    //     start_year: 2023,
    //     start_month: 8,
    //     end_year: 2023,
    //     end_month: 8,
    //   };
    //   const result = service.getOperationById(data);
    //   expect(result).toBeDefined();
    // });
  });
});
