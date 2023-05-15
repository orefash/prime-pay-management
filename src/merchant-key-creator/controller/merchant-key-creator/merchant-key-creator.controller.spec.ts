import { Test, TestingModule } from '@nestjs/testing';
import { MerchantKeyCreatorController } from './merchant-key-creator.controller';

describe('MerchantKeyCreatorController', () => {
  let controller: MerchantKeyCreatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantKeyCreatorController],
    }).compile();

    controller = module.get<MerchantKeyCreatorController>(MerchantKeyCreatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
