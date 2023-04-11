import { Test, TestingModule } from '@nestjs/testing';
import { MerchantAuthController } from './merchant-auth.controller';

describe('MerchantAuthController', () => {
  let controller: MerchantAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantAuthController],
    }).compile();

    controller = module.get<MerchantAuthController>(MerchantAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
