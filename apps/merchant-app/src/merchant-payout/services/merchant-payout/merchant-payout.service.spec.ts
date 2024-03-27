import { Test, TestingModule } from '@nestjs/testing';
import { MerchantPayoutService } from './merchant-payout.service';

describe('MerchantPayoutService', () => {
  let service: MerchantPayoutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MerchantPayoutService],
    }).compile();

    service = module.get<MerchantPayoutService>(MerchantPayoutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
