import { Test, TestingModule } from '@nestjs/testing';
import { MerchantProductController } from './merchant-product.controller';

describe('MerchantProductController', () => {
  let controller: MerchantProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantProductController],
    }).compile();

    controller = module.get<MerchantProductController>(MerchantProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
