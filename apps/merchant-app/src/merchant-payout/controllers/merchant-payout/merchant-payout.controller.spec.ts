import { Test, TestingModule } from '@nestjs/testing';
import { MerchantPayoutController } from './merchant-payout.controller';

describe('MerchantPayoutController', () => {
  let controller: MerchantPayoutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantPayoutController],
    }).compile();

    controller = module.get<MerchantPayoutController>(MerchantPayoutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
