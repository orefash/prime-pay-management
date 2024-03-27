import { Test, TestingModule } from '@nestjs/testing';
import { MerchantMediaController } from './merchant-media.controller';

describe('MerchantMediaController', () => {
  let controller: MerchantMediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantMediaController],
    }).compile();

    controller = module.get<MerchantMediaController>(MerchantMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
